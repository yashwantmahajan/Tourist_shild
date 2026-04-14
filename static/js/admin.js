/**
 * Admin Dashboard JavaScript
 * Handles live tourist data, SOS alerts, and table updates
 * Map: Google Maps (replaces Leaflet)
 */

let touristsInterval, sosInterval;
let adminMap, adminMarkers = [];

// ============== GOOGLE MAPS CALLBACK ==============
// Called by Maps SDK once loaded (callback=initAdminMaps)
function initAdminMaps() {
    initAdminTrackingMap();
    initGeoFencePicker();
}

// ============== ADMIN TRACKING MAP ==============
function initAdminTrackingMap() {
    const mapElement = document.getElementById('adminMap');
    if (!mapElement) return;

    adminMap = new google.maps.Map(mapElement, {
        center: { lat: 28.6139, lng: 77.2090 },
        zoom: 11,
        mapTypeControl: false
    });

    // Draw geo-fences from server-rendered data
    if (typeof GEO_FENCES_ADMIN !== 'undefined') {
        GEO_FENCES_ADMIN.forEach(f => {
            const color = f.zone_type === 'safe' ? '#10b981' : '#ef4444';
            new google.maps.Circle({
                map: adminMap,
                center: { lat: f.lat, lng: f.lng },
                radius: f.radius,
                fillColor: color,
                fillOpacity: 0.15,
                strokeColor: color,
                strokeWeight: 1.5
            });
        });
    }

    // Load initial tourist markers
    updateTouristMarkers();

    // Start polling for table and map
    startAdminPolling();
}

// ============== GEO-FENCE PICKER MAP ==============
// Defined in admin_dashboard.html and called from initAdminMaps
// (The function initGeoFencePicker is declared inline in the template)

// ============== POLLING ==============
function startAdminPolling() {
    updateTouristTable();
    touristsInterval = setInterval(updateTouristTable, 10000);
    setInterval(updateTouristMarkers, 15000);
}

function updateTouristTable() {
    fetch('/api/admin/live-data')
        .then(response => response.json())
        .then(tourists => {
            const tableBody = document.getElementById('touristsTableBody');
            if (!tableBody) return;

            if (tourists.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No tourists found</td></tr>';
                return;
            }

            let html = '';
            tourists.forEach(tourist => {
                const statusClass = getStatusClass(tourist.safety_score);
                html += `
                    <tr>
                        <td><strong>${tourist.digital_id}</strong></td>
                        <td>${tourist.name}</td>
                        <td>
                            <div class="progress" style="height: 8px;">
                                <div class="progress-bar bg-${statusClass}" 
                                     style="width: ${tourist.safety_score}%"></div>
                            </div>
                            <small>${tourist.safety_score}%</small>
                        </td>
                        <td><span class="badge bg-${statusClass}">${tourist.status}</span></td>
                        <td><small>${tourist.location}</small></td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary" 
                                    onclick="viewTouristDetails('${tourist.digital_id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });

            tableBody.innerHTML = html;
        })
        .catch(error => console.error('Tourist data error:', error));
}

function updateTouristMarkers() {
    if (!adminMap) return;
    fetch('/api/admin/live-data')
        .then(response => response.json())
        .then(tourists => {
            // Clear old markers
            adminMarkers.forEach(m => m.setMap(null));
            adminMarkers = [];
            tourists.forEach(tourist => {
                if (!tourist.lat || !tourist.lng) return;
                const color = getMarkerColor(tourist.safety_score);
                const marker = new google.maps.Marker({
                    position: { lat: tourist.lat, lng: tourist.lng },
                    map: adminMap,
                    title: tourist.name,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: color,
                        fillOpacity: 1,
                        strokeColor: '#fff',
                        strokeWeight: 2
                    }
                });
                const iw = new google.maps.InfoWindow({
                    content: `<strong>${tourist.name}</strong><br>Score: ${tourist.safety_score}%<br>Status: ${tourist.status}`
                });
                marker.addListener('click', () => iw.open(adminMap, marker));
                // Add tourist info to marker object for searching
                marker.touristInfo = tourist;
                marker.infoWindow = iw;
                adminMarkers.push(marker);
            });
        })
        .catch(error => console.error('Map markers error:', error));
}

function getStatusClass(score) {
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
}

function getMarkerColor(score) {
    if (score >= 80) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
}

// ============== SEVERITY FILTER ==============
function setupSeverityFilter() {
    const filterButtons = document.querySelectorAll('[data-severity-filter]');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const severity = this.getAttribute('data-severity-filter');
            filterAlerts(severity);

            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function filterAlerts(severity) {
    const alertItems = document.querySelectorAll('.alert-item');

    alertItems.forEach(item => {
        if (severity === 'all') {
            item.style.display = 'block';
        } else {
            if (item.classList.contains(`severity-${severity}`)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        }
    });
}

// ============== SEARCH MAP ==============
function searchTouristOnMap() {
    const query = document.getElementById('mapSearchInput').value.toLowerCase().trim();
    if (!query) {
        showToast('Please enter a name or ID to search', 'warning');
        return;
    }
    
    let found = false;
    for (let marker of adminMarkers) {
        if (!marker.touristInfo) continue;
        const name = (marker.touristInfo.name || '').toLowerCase();
        const id = (marker.touristInfo.digital_id || '').toLowerCase();
        
        if (name.includes(query) || id.includes(query)) {
            // Center map and open info window
            adminMap.setZoom(16);
            adminMap.panTo(marker.getPosition());
            marker.infoWindow.open(adminMap, marker);
            found = true;
            break;
        }
    }
    
    if (!found) {
        showToast('Tourist not found on the map', 'danger');
    }
}

// ============== SOS DISPATCH ==============
function dispatchSOS(sosId) {
    if (!confirm('Dispatch police units to this location?')) return;

    fetch(`/api/admin/dispatch/${sosId}`, {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                showToast('Police units dispatched successfully!', 'success');
                setTimeout(() => location.reload(), 1500);
            }
        })
        .catch(error => {
            showToast('Failed to dispatch units', 'danger');
            console.error('Dispatch error:', error);
        });
}

function viewTouristDetails(digitalId) {
    showToast(`Viewing details for ${digitalId}`, 'info');
}

// Severity filter setup on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    setupSeverityFilter();
});

// Cleanup
window.addEventListener('beforeunload', function () {
    if (touristsInterval) clearInterval(touristsInterval);
    if (sosInterval) clearInterval(sosInterval);
});

// Make functions globally available
window.dispatchSOS = dispatchSOS;
window.viewTouristDetails = viewTouristDetails;
window.initAdminMaps = initAdminMaps;
window.searchTouristOnMap = searchTouristOnMap;
