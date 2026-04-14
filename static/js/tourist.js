/**
 * Tourist Dashboard JavaScript
 * GPS triggers the native browser permission popup automatically on load.
 * User just clicks Allow in the popup — done. No settings needed.
 */

let map, userMarker, accuracyCircle, locationWatchId;
let statusInterval, alertsInterval;

window._liveGPSLat = null;
window._liveGPSLng = null;

// ============== PAGE LOAD ==============
document.addEventListener('DOMContentLoaded', function () {
    startPolling();
    setupPanicButton();
});

// ============== GOOGLE MAPS CALLBACK ==============
function initMap() {
    const mapElement = document.getElementById('touristMap');
    if (!mapElement) return;

    const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // India center

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

    // ---- IMMEDIATELY request location (triggers native browser popup) ----
    requestLiveLocation();
}

// ============== IMMEDIATELY TRIGGER NATIVE BROWSER POPUP ==============
function requestLiveLocation() {
    if (!navigator.geolocation) {
        setGPSStatus('unsupported');
        return;
    }

    // Check if previously blocked — if so show instructions, don't re-ask
    if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'geolocation' }).then(function (perm) {
            if (perm.state === 'denied') {
                // Was previously blocked — native popup will NOT appear again
                // Show instructions on how to reset it
                setGPSStatus('blocked');
            } else {
                // 'granted' or 'prompt':
                //   - 'granted': starts silently with no popup
                //   - 'prompt': browser shows the Allow/Block popup NOW
                setGPSStatus('acquiring');
                startGPSWithFallback();
            }

            // Auto-react if user changes permission in browser settings later
            perm.addEventListener('change', function () {
                if (perm.state === 'granted') {
                    setGPSStatus('acquiring');
                    startGPSWithFallback();
                } else if (perm.state === 'denied') {
                    setGPSStatus('blocked');
                }
            });
        }).catch(function () {
            // Permissions API not supported — call GPS directly, shows popup
            setGPSStatus('acquiring');
            startGPSWithFallback();
        });
    } else {
        // No Permissions API — call GPS directly, browser will show popup
        setGPSStatus('acquiring');
        startGPSWithFallback();
    }
}

// ============== GPS: HIGH ACCURACY → LOW ACCURACY FALLBACK ==============
function startGPSWithFallback() {
    // Try high accuracy first (real GPS / WiFi triangulation)
    // On laptops without GPS chip this may time out → we fallback to low accuracy
    navigator.geolocation.getCurrentPosition(
        function (pos) {
            onGPSSuccess(pos);
            beginWatching(true);
        },
        function (err) {
            if (err.code === 1) {
                // User clicked Block in the popup
                setGPSStatus('blocked');
                return;
            }
            // Timeout or unavailable — retry with low accuracy (IP/WiFi)
            navigator.geolocation.getCurrentPosition(
                function (pos) {
                    onGPSSuccess(pos);
                    beginWatching(false);
                },
                function (err2) {
                    if (err2.code === 1) {
                        setGPSStatus('blocked');
                    } else {
                        setGPSStatus('error', 'Could not get location. Tap Retry.');
                    }
                },
                { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 }
            );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

// ============== CONTINUOUS WATCH ==============
function beginWatching(highAccuracy) {
    if (locationWatchId != null) return;
    locationWatchId = navigator.geolocation.watchPosition(
        onGPSSuccess,
        function (err) { if (err.code === 1) setGPSStatus('blocked'); },
        { enableHighAccuracy: highAccuracy, maximumAge: 10000, timeout: 30000 }
    );
}

// ============== GPS SUCCESS ==============
function onGPSSuccess(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    window._liveGPSLat = lat;
    window._liveGPSLng = lng;

    const latLng = new google.maps.LatLng(lat, lng);

    // Move marker & pan map IMMEDIATELY
    if (userMarker) userMarker.setPosition(latLng);
    if (map) {
        map.panTo(latLng);
        map.setZoom(15);
    }

    // Accuracy circle
    if (accuracyCircle) {
        accuracyCircle.setCenter(latLng);
        accuracyCircle.setRadius(accuracy);
    } else {
        accuracyCircle = new google.maps.Circle({
            map: map,
            center: latLng,
            radius: accuracy,
            fillColor: '#3b82f6',
            fillOpacity: 0.12,
            strokeColor: '#3b82f6',
            strokeWeight: 1,
            strokeOpacity: 0.6
        });
    }

    const rawCoords = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    setGPSStatus('active', `±${Math.round(accuracy)}m`);

    // Update location label immediately
    const locEl = document.getElementById('currentLocation');
    if (locEl) locEl.textContent = rawCoords;

    // POST real coords to backend immediately
    fetch('/api/tourist/update-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, location_name: rawCoords })
    }).catch(() => {});

    // Reverse geocode to get real address (done async, updates label when ready)
    reverseGeocode(lat, lng, function (locationName) {
        if (locEl) locEl.textContent = locationName;
        setGPSStatus('active', locationName);
        fetch('/api/tourist/update-location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lng, location_name: locationName })
        }).catch(() => {});
    });
}

// ============== BUTTON: RETRY (only shown when blocked/error) ==============
function enableLiveTracking() {
    if (!navigator.geolocation) { setGPSStatus('unsupported'); return; }
    if (locationWatchId != null) {
        navigator.geolocation.clearWatch(locationWatchId);
        locationWatchId = null;
    }
    setGPSStatus('acquiring');
    startGPSWithFallback();
}

// ============== GPS STATUS BAR ==============
function setGPSStatus(state, detail) {
    const bar  = document.getElementById('gpsStatusBar');
    const icon = document.getElementById('gpsStatusIcon');
    const text = document.getElementById('gpsStatusText');
    const btn  = document.getElementById('enableGPSBtn');
    const instr = document.getElementById('gpsBlockedInstructions');
    if (!bar) return;

    if (state === 'active') {
        bar.style.cssText = 'background:rgba(16,185,129,0.12);border:1px solid #10b981;transition:all 0.4s;';
        if (icon) icon.innerHTML = '<i class="fas fa-satellite-dish text-success"></i>';
        if (text) text.innerHTML = `<span class="text-success fw-semibold">🟢 Live</span>&nbsp;&nbsp;<small class="text-muted">${detail || 'GPS active'}</small>`;
        if (btn)  btn.style.display = 'none';
        if (instr) instr.style.display = 'none';

    } else if (state === 'acquiring') {
        bar.style.cssText = 'background:rgba(59,130,246,0.1);border:1px solid #3b82f6;transition:all 0.4s;';
        if (icon) icon.innerHTML = '<i class="fas fa-spinner fa-spin text-primary"></i>';
        if (text) text.innerHTML = '<span class="text-primary fw-semibold">Acquiring GPS…</span><small class="text-muted ms-2">Please allow location when the browser asks</small>';
        if (btn)  btn.style.display = 'none';
        if (instr) instr.style.display = 'none';

    } else if (state === 'blocked') {
        bar.style.cssText = 'background:rgba(239,68,68,0.08);border:1px solid #ef4444;transition:all 0.4s;';
        if (icon) icon.innerHTML = '<i class="fas fa-ban text-danger"></i>';
        if (text) text.innerHTML = '<span class="text-danger fw-semibold">Location blocked</span><small class="text-muted ms-2">— you previously denied access</small>';
        if (btn) {
            btn.style.display = 'inline-flex';
            btn.className = 'btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1';
            btn.innerHTML = '<i class="fas fa-redo"></i> Retry';
            btn.onclick = enableLiveTracking;
        }
        if (instr) instr.style.display = 'block';

    } else if (state === 'error') {
        bar.style.cssText = 'background:rgba(245,158,11,0.1);border:1px solid #f59e0b;transition:all 0.4s;';
        if (icon) icon.innerHTML = '<i class="fas fa-exclamation-triangle text-warning"></i>';
        if (text) text.innerHTML = `<span class="text-warning fw-semibold">${detail || 'GPS error'}</span>`;
        if (btn) {
            btn.style.display = 'inline-flex';
            btn.className = 'btn btn-sm btn-warning d-inline-flex align-items-center gap-1';
            btn.innerHTML = '<i class="fas fa-redo"></i> Retry';
            btn.onclick = enableLiveTracking;
        }
        if (instr) instr.style.display = 'none';

    } else if (state === 'unsupported') {
        bar.style.cssText = 'background:#f3f4f6;border:1px solid #d1d5db;';
        if (icon) icon.innerHTML = '<i class="fas fa-ban text-muted"></i>';
        if (text) text.innerHTML = '<span class="text-muted">Geolocation not supported in this browser</span>';
        if (btn)  btn.style.display = 'none';
        if (instr) instr.style.display = 'none';
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
    } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            p => reverseGeocode(p.coords.latitude, p.coords.longitude,
                name => post(p.coords.latitude, p.coords.longitude, name)),
            () => post(null, null, 'Unknown'),
            { enableHighAccuracy: false, timeout: 8000 }
        );
    } else { post(null, null, 'Unknown'); }
}

window.updateAlerts = updateAlerts;
window.enableLiveTracking = enableLiveTracking;

window.addEventListener('beforeunload', function () {
    clearInterval(statusInterval); clearInterval(alertsInterval);
    if (locationWatchId != null) navigator.geolocation.clearWatch(locationWatchId);
});
