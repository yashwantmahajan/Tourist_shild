/**
 * Tourist Dashboard JavaScript
 * ─────────────────────────────────────────────────────────────────
 * STRATEGY — 3-tier location (no permission block possible):
 *
 *  Tier 1 (INSTANT, 0 ms, ZERO permission):
 *      Call /api/tourist/ip-location → server looks up the visitor's
 *      IP address and returns city-level lat/lng immediately.
 *      Map is placed and location is saved to DB right away.
 *
 *  Tier 2 (BETTER, asks permission once):
 *      navigator.geolocation — if user allows it upgrades to street-
 *      level accuracy and keeps the marker live. If user denies it
 *      we stay on Tier 1 silently (no error shown to user).
 *
 *  Tier 3 (BACKUP):
 *      If the IP lookup also fails we centre on India.
 * ─────────────────────────────────────────────────────────────────
 */

let map, userMarker, accuracyCircle, locationWatchId;
let statusInterval, alertsInterval;

window._liveGPSLat = window.LAST_KNOWN_LAT || null;
window._liveGPSLng = window.LAST_KNOWN_LNG || null;

// ============== PAGE LOAD ==============
document.addEventListener('DOMContentLoaded', function () {
    startPolling();
    setupPanicButton();
});

// ============== GOOGLE MAPS CALLBACK ==============
function initMap() {
    const mapElement = document.getElementById('touristMap');
    if (!mapElement) return;

    const defaultCenter = { 
        lat: window.LAST_KNOWN_LAT || 20.5937, 
        lng: window.LAST_KNOWN_LNG || 78.9629 
    };

    map = new google.maps.Map(mapElement, {
        center: defaultCenter,
        zoom: 5,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true
    });

    userMarker = new google.maps.Marker({
        position: defaultCenter,
        map: map,
        title: 'Your Location',
        animation: google.maps.Animation.DROP,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 11,
            fillColor: '#3b82f6',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3
        }
    });

    loadGeoFenceCircles();

    // ── DIRECT FORCE GPS ON PAGE LOAD ──
    setGPSStatus('acquiring', 'Requesting direct GPS location...');
    tryGPSUpgrade();
}

// ============== DIRECT GPS FETCH & FALLBACK ==============
function tryGPSUpgrade() {
    if (!navigator.geolocation) {
        fetchIpLocation();
        return;
    }

    // Attempt direct explicit fetch so browser asks permission instantly.
    navigator.geolocation.getCurrentPosition(
        function (pos) {
            // Success
            onGPSSuccess(pos, true);
            beginWatching(true);
        },
        function (err) {
            console.warn("GPS Request Error:", err.message);
            if (err.code === 1) {
                // Permission Denied
                let instr = document.getElementById('gpsBlockedInstructions');
                if (instr) instr.style.display = 'block';
                setGPSStatus('blocked', 'GPS blocked, falling back to IP...');
            } else {
                setGPSStatus('error', 'GPS unavailable, falling back to IP...');
            }
            fetchIpLocation();
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
}

function fetchIpLocation() {
    fetch('/api/tourist/ip-location')
        .then(r => r.json())
        .then(data => {
            if (!window._liveGPSLat) {
                placeMarker(data.lat, data.lng, data.city ? `${data.city}, ${data.country}` : 'IP Detected Location');
                setGPSStatus('ip', `📍 ${data.city || 'IP Location'} (Approx.)`);
            }
        }).catch(() => {
            if (!window._liveGPSLat) setGPSStatus('error', 'Could not fetch location.');
        });
}

// ============== CONTINUOUS WATCH ==============
function beginWatching(highAccuracy = true) {
    if (locationWatchId != null) return;
    locationWatchId = navigator.geolocation.watchPosition(
        pos => onGPSSuccess(pos, highAccuracy),
        () => { /* silent — already on IP location */ },
        { enableHighAccuracy: highAccuracy, maximumAge: 10000, timeout: 30000 }
    );
}

// ============== GPS SUCCESS → upgrade from IP to GPS ==============
function onGPSSuccess(position, highAccuracy) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    window._liveGPSLat = lat;
    window._liveGPSLng = lng;

    placeMarker(lat, lng, `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    setGPSStatus('active', `±${Math.round(accuracy)}m`);

    // Accuracy circle
    const latLng = new google.maps.LatLng(lat, lng);
    if (accuracyCircle) {
        accuracyCircle.setCenter(latLng);
        accuracyCircle.setRadius(accuracy);
    } else {
        accuracyCircle = new google.maps.Circle({
            map, center: latLng, radius: accuracy,
            fillColor: '#3b82f6', fillOpacity: 0.12,
            strokeColor: '#3b82f6', strokeWeight: 1, strokeOpacity: 0.6
        });
    }

    const locEl = document.getElementById('currentLocation');
    if (locEl) locEl.textContent = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

    // POST raw coords immediately
    pushLocation(lat, lng, `${lat.toFixed(5)}, ${lng.toFixed(5)}`);

    // Then reverse-geocode for a human-readable address
    reverseGeocode(lat, lng, function (locationName) {
        if (locEl) locEl.textContent = locationName;
        setGPSStatus('active', locationName);
        pushLocation(lat, lng, locationName);
    });
}

// ============== PLACE MARKER ON MAP ==============
function placeMarker(lat, lng, label) {
    const latLng = new google.maps.LatLng(lat, lng);
    if (userMarker) userMarker.setPosition(latLng);
    if (map) { map.panTo(latLng); map.setZoom(14); }

    const locEl = document.getElementById('currentLocation');
    if (locEl && label) locEl.textContent = label;

    // Save to DB
    pushLocation(lat, lng, label || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
}

// ============== PUSH LOCATION TO BACKEND ==============
function pushLocation(lat, lng, location_name) {
    fetch('/api/tourist/update-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, location_name })
    }).catch(() => {});
}

// ============== MANUAL RETRY BUTTON ==============
function enableLiveTracking() {
    if (locationWatchId != null) {
        navigator.geolocation.clearWatch(locationWatchId);
        locationWatchId = null;
    }
    window._liveGPSLat = null;
    window._liveGPSLng = null;
    setGPSStatus('acquiring', 'Retrying GPS…');
    tryGPSUpgrade();
}

// ============== GPS STATUS BAR ==============
function setGPSStatus(state, detail) {
    const bar   = document.getElementById('gpsStatusBar');
    const icon  = document.getElementById('gpsStatusIcon');
    const text  = document.getElementById('gpsStatusText');
    const btn   = document.getElementById('enableGPSBtn');
    const instr = document.getElementById('gpsBlockedInstructions');
    if (!bar) return;

    // Always hide blocked instructions unless we explicitly set 'blocked'
    if (instr && state !== 'blocked') instr.style.display = 'none';

    if (state === 'active') {
        bar.style.cssText = 'background:rgba(16,185,129,0.12);border:1px solid #10b981;transition:all 0.4s;';
        if (icon) icon.innerHTML = '<i class="fas fa-satellite-dish text-success"></i>';
        if (text) text.innerHTML = `<span class="text-success fw-semibold">🟢 Live GPS</span>&nbsp;&nbsp;<small class="text-muted">${detail || 'GPS active'}</small>`;
        if (btn)  btn.style.display = 'none';

    } else if (state === 'ip') {
        bar.style.cssText = 'background:rgba(59,130,246,0.08);border:1px solid #3b82f6;transition:all 0.4s;';
        if (icon) icon.innerHTML = '<i class="fas fa-globe text-primary"></i>';
        if (text) text.innerHTML = `<span class="text-primary fw-semibold">${detail || '📍 Location detected'}</span><small class="text-muted ms-2">— Trying GPS for better accuracy…</small>`;
        if (btn)  btn.style.display = 'none';

    } else if (state === 'acquiring') {
        bar.style.cssText = 'background:rgba(59,130,246,0.1);border:1px solid #3b82f6;transition:all 0.4s;';
        if (icon) icon.innerHTML = '<i class="fas fa-spinner fa-spin text-primary"></i>';
        if (text) text.innerHTML = `<span class="text-primary fw-semibold">${detail || 'Detecting location…'}</span>`;
        if (btn)  btn.style.display = 'none';

    } else if (state === 'blocked') {
        bar.style.cssText = 'background:rgba(245,158,11,0.08);border:1px solid #f59e0b;transition:all 0.4s;';
        if (icon) icon.innerHTML = '<i class="fas fa-info-circle text-warning"></i>';
        if (text) text.innerHTML = '<span class="text-warning fw-semibold">Using IP-based location</span><small class="text-muted ms-2">— Allow GPS for better accuracy</small>';
        if (btn) {
            btn.style.display = 'inline-flex';
            btn.className = 'btn btn-sm btn-outline-warning d-inline-flex align-items-center gap-1';
            btn.innerHTML = '<i class="fas fa-location-arrow"></i> Enable GPS';
            btn.onclick = enableLiveTracking;
        }

    } else if (state === 'error') {
        bar.style.cssText = 'background:rgba(245,158,11,0.1);border:1px solid #f59e0b;transition:all 0.4s;';
        if (icon) icon.innerHTML = '<i class="fas fa-exclamation-triangle text-warning"></i>';
        if (text) text.innerHTML = `<span class="text-warning fw-semibold">${detail || 'GPS unavailable'}</span><small class="text-muted ms-2">— Using IP location</small>`;
        if (btn) {
            btn.style.display = 'inline-flex';
            btn.className = 'btn btn-sm btn-warning d-inline-flex align-items-center gap-1';
            btn.innerHTML = '<i class="fas fa-redo"></i> Retry GPS';
            btn.onclick = enableLiveTracking;
        }

    } else if (state === 'unsupported') {
        bar.style.cssText = 'background:#f3f4f6;border:1px solid #d1d5db;';
        if (icon) icon.innerHTML = '<i class="fas fa-globe text-muted"></i>';
        if (text) text.innerHTML = '<span class="text-muted">Using IP-based location (device has no GPS)</span>';
        if (btn)  btn.style.display = 'none';
    }
}

// ============== REVERSE GEOCODE ==============
function reverseGeocode(lat, lng, callback) {
    try {
        if (typeof google === 'undefined' || !google.maps || !google.maps.Geocoder) {
            callback(`${lat.toFixed(5)}, ${lng.toFixed(5)}`); return;
        }
        new google.maps.Geocoder().geocode({ location: { lat, lng } }, function (results, status) {
            if (status === 'OK' && results[0]) callback(results[0].formatted_address);
            else callback(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        });
    } catch (e) { callback(`${lat.toFixed(5)}, ${lng.toFixed(5)}`); }
}

// ============== GEO-FENCE CIRCLES ==============
function loadGeoFenceCircles() {
    fetch('/api/tourist/zone-check')
        .then(r => r.json())
        .then(data => {
            if (data.fences && data.fences.length > 0) {
                data.fences.forEach(fence => {
                    const color = fence.zone_type === 'safe' ? '#10b981' : '#ef4444';
                    new google.maps.Circle({
                        map, center: { lat: fence.lat, lng: fence.lng },
                        radius: fence.radius_km * 1000,
                        fillColor: color, fillOpacity: 0.18,
                        strokeColor: color, strokeWeight: 2
                    });
                });
            }
        }).catch(() => {});
}

// ============== STATUS POLLING ==============
function startPolling() {
    updateStatus();
    statusInterval = setInterval(updateStatus, 10000);
    updateAlerts();
    alertsInterval = setInterval(updateAlerts, 10000);
}

function updateStatus() {
    fetch('/api/tourist/status')
        .then(r => r.json())
        .then(data => {
            const s = document.getElementById('safetyScore');
            if (s) s.textContent = data.safety_score;
            const b = document.getElementById('statusBadge');
            if (b) { b.textContent = data.status; b.className = `badge badge-custom bg-${data.badge_color}`; }
            if (!window._liveGPSLat) {
                const l = document.getElementById('currentLocation');
                if (l) l.textContent = data.location;
            }
        }).catch(() => {});
}

function updateAlerts() {
    fetch('/api/tourist/alerts')
        .then(r => r.json())
        .then(alerts => {
            const c = document.getElementById('alertsContainer');
            if (!c) return;
            if (alerts.length === 0) { c.innerHTML = `<p class="text-muted text-center">${_t('no_alerts_text')}</p>`; return; }
            c.innerHTML = alerts.map(a => {
                const sev = (a.severity || 'low').toLowerCase();
                return `<div class="alert-item severity-${a.severity}">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <div class="fw-bold mb-1">${translateAlertMessage(a.message)}</div>
                            <small class="text-muted"><i class="fas fa-clock me-1"></i>${a.time}</small>
                        </div>
                        <span class="badge bg-${getSeverityColor(sev)} ms-2">${_t('severity_' + sev) || sev.toUpperCase()}</span>
                    </div>
                </div>`;
            }).join('');
        }).catch(() => {});
}

function getSeverityColor(s) {
    return { low: 'info', medium: 'warning', high: 'danger', critical: 'dark' }[s] || 'secondary';
}

function _t(key) {
    try {
        const lang = localStorage.getItem('ts_lang') || 'en';
        return (window.TRANSLATIONS?.[lang]?.[key]) || key;
    } catch (e) { return key; }
}

function translateAlertMessage(msg) {
    if (!msg) return msg;
    const lang = localStorage.getItem('ts_lang') || 'en';
    if (lang === 'en') return msg;
    const map = {
        "AI detected safe route ahead": 'alert_msg_safe_route',
        "Weather conditions optimal for travel": 'alert_msg_weather_ok',
        "Moderate crowd density in your area": 'alert_msg_crowd',
        "Route deviation detected - verify safety": 'alert_msg_route_deviation',
        "Entering area with higher crime statistics": 'alert_msg_crime_area',
        "Unusual inactivity pattern detected": 'alert_msg_inactivity',
        "Possible distress signal - location drop-off detected": 'alert_msg_distress',
    };
    if (map[msg]) return _t(map[msg]);
    let m = msg.match(/MEDICAL EMERGENCY:\s*(.+?)\s+needs immediate medical assistance!/);
    if (m) return `🚑 चिकित्सा आपात: ${m[1]} ${_t('alert_msg_medical_sos')}`;
    m = msg.match(/POLICE SOS:\s*(.+?)\s+needs immediate police assistance!/);
    if (m) return `🚨 पुलिस SOS: ${m[1]} ${_t('alert_msg_police_sos')}`;
    m = msg.match(/PANIC SOS:\s*(.+?)\s+in IMMEDIATE DANGER!/);
    if (m) return `🚨 पैनिक SOS: ${m[1]} ${_t('alert_msg_panic')}`;
    m = msg.match(/Entered high-risk zone:\s*(.+)/);
    if (m) return `⚠️ ${_t('alert_msg_zone')}: ${m[1]}`;
    return msg;
}

// ============== SOS ==============
function setupPanicButton() {
    document.getElementById('policeSOSButton')?.addEventListener('click', function () {
        if (confirm('⚠️ POLICE SOS - Are you in immediate danger?\n\nThis will dispatch police units to your location.'))
            sendSOSRequest('/api/tourist/panic/police', '🚨 POLICE SOS SENT! Officers dispatched.');
    });
    document.getElementById('hospitalSOSButton')?.addEventListener('click', function () {
        if (confirm('🚑 MEDICAL EMERGENCY - Need immediate medical assistance?\n\nThis will dispatch an ambulance.'))
            sendSOSRequest('/api/tourist/panic/hospital', '🚑 AMBULANCE SENT! Medical team dispatched.');
    });
}

function sendSOSRequest(endpoint, successMsg) {
    function post(lat, lng, name) {
        fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lng, location: name }) })
            .then(r => r.json())
            .then(d => {
                if (d.status === 'success') { showToast(successMsg, endpoint.includes('police') ? 'danger' : 'info'); setTimeout(updateAlerts, 1000); }
                else showToast(d.error || 'Failed to send SOS', 'danger');
            }).catch(() => showToast('Failed to send SOS', 'danger'));
    }
    if (window._liveGPSLat) {
        reverseGeocode(window._liveGPSLat, window._liveGPSLng,
            name => post(window._liveGPSLat, window._liveGPSLng, name));
    } else {
        // Use the IP location already saved in DB
        fetch('/api/tourist/ip-location')
            .then(r => r.json())
            .then(d => {
                const name = d.city ? `${d.city}, ${d.country}` : `${d.lat}, ${d.lng}`;
                post(d.lat, d.lng, name);
            })
            .catch(() => post(null, null, 'Unknown'));
    }
}

window.updateAlerts = updateAlerts;
window.enableLiveTracking = enableLiveTracking;

window.addEventListener('beforeunload', function () {
    clearInterval(statusInterval); clearInterval(alertsInterval);
    if (locationWatchId != null) navigator.geolocation.clearWatch(locationWatchId);
});
