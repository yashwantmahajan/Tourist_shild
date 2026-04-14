/**
 * Ambulance Live Tracking Module - E-Commerce Style
 * Professional tracking interface with delivery-style progress tracking
 */

/** Tiny translation helper — works alongside hi.js */
function _tAmb(key) {
    try {
        const lang = localStorage.getItem('ts_lang') || 'en';
        return (window.TRANSLATIONS && window.TRANSLATIONS[lang] && window.TRANSLATIONS[lang][key])
            ? window.TRANSLATIONS[lang][key]
            : (window.TRANSLATIONS && window.TRANSLATIONS['en'] && window.TRANSLATIONS['en'][key])
                ? window.TRANSLATIONS['en'][key]
                : key;
    } catch (e) { return key; }
}

class AmbulanceTracker {
    constructor() {
        this.map = null;
        this.ambulanceMarker = null;
        this.touristMarker = null;
        this.routeLine = null;
        this.hospitalReqId = null;
        this.updateInterval = null;
        this.simulationInterval = null;
    }

    /**
     * Check for active ambulance (shows track button if active)
     */
    async checkForActiveAmbulance() {
        try {
            const response = await fetch('/api/tourist/active-ambulance');
            const data = await response.json();

            if (data.active) {
                this.hospitalReqId = data.hospital_req_id;
                // Show the track button instead of auto-opening modal
                const trackBtn = document.getElementById('trackAmbulanceBtn');
                if (trackBtn) {
                    trackBtn.style.display = 'block';
                }
            } else {
                // Hide track button if no active ambulance
                const trackBtn = document.getElementById('trackAmbulanceBtn');
                if (trackBtn) {
                    trackBtn.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Error checking for active ambulance:', error);
        }
    }

    /**
     * Manually open tracking modal (called from Track button)
     */
    openTracking() {
        if (this.hospitalReqId) {
            this.showTrackingModal();
        } else {
            alert('No active ambulance request found. Please request an ambulance first.');
        }
    }

    /**
     * Show the ambulance tracking modal
     */
    showTrackingModal() {
        // Create modal if it doesn't exist
        if (!document.getElementById('ambulanceTrackingModal')) {
            this.createTrackingModal();
        }

        const modalElement = document.getElementById('ambulanceTrackingModal');
        const modal = new bootstrap.Modal(modalElement);

        // Initialize map after modal is fully shown
        modalElement.addEventListener('shown.bs.modal', () => {
            if (!this.map) {
                // Increased timeout to ensure modal is fully rendered
                setTimeout(() => {
                    this.initializeMap();
                    // Force map to recalculate size
                    if (this.map) {
                        this.map.invalidateSize();
                    }
                    this.startTracking();
                }, 300);
            }
        }, { once: true });

        // Cleanup on modal close
        modalElement.addEventListener('hidden.bs.modal', () => {
            this.stopTracking();
            this.cleanup();
        }, { once: true });

        modal.show();
    }

    /**
     * Create the tracking modal HTML - E-Commerce Delivery Style
     */
    createTrackingModal() {
        const modalHTML = `
            <div class="modal fade" id="ambulanceTrackingModal" tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 16px; overflow: hidden; border: none; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                        <!-- Header -->
                        <div class="modal-header" style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; border: none; padding: 1.25rem 1.5rem;">
                            <div>
                                <h5 class="modal-title mb-1" style="font-size: 1.1rem;">
                                    <i class="fas fa-ambulance me-2"></i>
                                    ${_tAmb('amb_tracking_title')}
                                </h5>
                                <small style="opacity: 0.9; font-size: 0.85rem;">${_tAmb('amb_realtime')}</small>
                            </div>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        
                        <div class="modal-body p-0">
                            <!-- E-Commerce Style Progress Tracker -->
                            <div class="p-3" style="background: linear-gradient(to bottom, #fef2f2, #ffffff);">
                                <div class="tracking-timeline">
                                    <div class="timeline-step" id="step-assigned">
                                        <div class="timeline-icon">
                                            <i class="fas fa-check-circle"></i>
                                        </div>
                                        <div class="timeline-content">
                                            <strong style="font-size: 0.9rem;">${_tAmb('amb_step_assigned')}</strong>
                                            <small class="d-block text-muted" id="time-assigned" style="font-size: 0.7rem;">---</small>
                                        </div>
                                    </div>
                                    <div class="timeline-connector"></div>
                                    <div class="timeline-step" id="step-dispatched">
                                        <div class="timeline-icon">
                                            <i class="fas fa-shipping-fast"></i>
                                        </div>
                                        <div class="timeline-content">
                                            <strong style="font-size: 0.9rem;">${_tAmb('amb_step_on_way')}</strong>
                                            <small class="d-block text-muted" id="time-dispatched" style="font-size: 0.7rem;">---</small>
                                        </div>
                                    </div>
                                    <div class="timeline-connector"></div>
                                    <div class="timeline-step" id="step-arrived">
                                        <div class="timeline-icon">
                                            <i class="fas fa-map-marker-alt"></i>
                                        </div>
                                        <div class="timeline-content">
                                            <strong style="font-size: 0.9rem;">${_tAmb('amb_step_arrived')}</strong>
                                            <small class="d-block text-muted" id="time-arrived" style="font-size: 0.7rem;">---</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Info Cards -->
                            <div class="px-3 pb-2">
                                <div class="row g-2">
                                    <div class="col-md-4">
                                        <div class="info-card">
                                            <div class="info-icon" style="background: #fee2e2; color: #dc2626;">
                                                <i class="fas fa-ambulance"></i>
                                            </div>
                                            <div class="info-details">
                                                <small class="text-muted">${_tAmb('amb_unit_label')}</small>
                                                <strong id="ambulanceUnit" class="d-block">---</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="info-card">
                                            <div class="info-icon" style="background: #dbeafe; color: #2563eb;">
                                                <i class="fas fa-clock"></i>
                                            </div>
                                            <div class="info-details">
                                                <small class="text-muted">${_tAmb('amb_eta_label')}</small>
                                                <strong id="ambulanceETA" class="d-block text-primary">---</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="info-card">
                                            <div class="info-icon" style="background: #dcfce7; color: #16a34a;">
                                                <i class="fas fa-route"></i>
                                            </div>
                                            <div class="info-details">
                                                <small class="text-muted">${_tAmb('amb_distance_label')}</small>
                                                <strong id="ambulanceDistance" class="d-block text-success">---</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Map Container -->
                            <div class="px-3 pb-3">
                                <div style="border-radius: 12px; overflow: hidden; border: 2px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                    <div id="ambulanceMap" style="height: 350px; width: 100%;"></div>
                                </div>
                            </div>

                            <!-- Live Update Indicator -->
                            <div class="px-3 pb-3">
                                <div class="live-update-bar">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="text-muted">
                                            <span class="live-dot"></span>
                                            ${_tAmb('amb_live_text')}
                                        </span>
                                        <span id="lastUpdateTime" class="text-muted small">---</span>
                                    </div>
                                    <div class="progress" style="height: 8px; border-radius: 10px; background: #e5e7eb;">
                                        <div id="trackingProgress" class="progress-bar" 
                                             style="background: linear-gradient(90deg, #dc2626, #ef4444); border-radius: 10px;"
                                             role="progressbar"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addTrackingStyles();
    }

    /**
     * Add custom styles for e-commerce tracking UI
     */
    addTrackingStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .tracking-timeline {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                position: relative;
                padding: 1rem 0;
            }

            .timeline-step {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                position: relative;
                z-index: 2;
            }

            .timeline-icon {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: #e5e7eb;
                color: #9ca3af;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                margin-bottom: 0.5rem;
                transition: all 0.3s ease;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            .timeline-step.active .timeline-icon {
                background: linear-gradient(135deg, #dc2626, #ef4444);
                color: white;
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
            }

            .timeline-step.completed .timeline-icon {
                background: #10b981;
                color: white;
            }

            .timeline-connector {
                flex: 1;
                height: 4px;
                background: #e5e7eb;
                margin: 30px -10px 0;
                position: relative;
                z-index: 1;
                transition: all 0.3s ease;
            }

            .timeline-connector.active {
                background: linear-gradient(90deg, #10b981, #dc2626);
            }

            .timeline-connector.completed {
                background: #10b981;
            }

            .timeline-content strong {
                font-size: 0.95rem;
                color: #1f2937;
            }

            .timeline-content small {
                font-size: 0.75rem;
            }

            .info-card {
                background: white;
                border-radius: 12px;
                padding: 1rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                border: 1px solid #e5e7eb;
                transition: all 0.3s ease;
            }

            .info-card:hover {
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                transform: translateY(-2px);
            }

            .info-icon {
                width: 50px;
                height: 50px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
            }

            .info-details {
                flex: 1;
            }

            .info-details small {
                font-size: 0.75rem;
                display: block;
                margin-bottom: 0.25rem;
            }

            .info-details strong {
                font-size: 1.1rem;
            }

            .live-update-bar {
                background: white;
                border-radius: 12px;
                padding: 1rem;
                border: 1px solid #e5e7eb;
            }

            .live-dot {
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #dc2626;
                animation: pulse 2s ease-in-out infinite;
                margin-right: 0.5rem;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.2); }
            }

            @media (max-width: 768px) {
                .tracking-timeline {
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .timeline-connector {
                    width: 4px;
                    height: 40px;
                    margin: 0 auto;
                }
                
                .timeline-step {
                    flex-direction: row;
                    text-align: left;
                    gap: 1rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Initialize Leaflet map with ambulance icon
     */
    initializeMap() {
        this.map = L.map('ambulanceMap').setView([28.6139, 77.2090], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);

        // Custom ambulance icon with actual ambulance emoji/icon
        const ambulanceIcon = L.divIcon({
            className: 'custom-ambulance-marker',
            html: `
                <div style="position: relative;">
                    <div style="background: #dc2626; color: white; padding: 12px; border-radius: 50%; font-size: 24px; box-shadow: 0 6px 20px rgba(220, 38, 38, 0.5); border: 4px solid white; animation: ambulancePulse 2s ease-in-out infinite;">
                        <i class="fas fa-ambulance"></i>
                    </div>
                    <div style="position: absolute; top: -8px; right: -8px; background: #10b981; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border: 2px solid white;">
                        <i class="fas fa-heartbeat"></i>
                    </div>
                </div>
            `,
            iconSize: [50, 50],
            iconAnchor: [25, 25]
        });

        const touristIcon = L.divIcon({
            className: 'custom-tourist-marker',
            html: `
                <div style="background: #2563eb; color: white; padding: 12px; border-radius: 50%; font-size: 24px; box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5); border: 4px solid white;">
                    <i class="fas fa-user"></i>
                </div>
            `,
            iconSize: [50, 50],
            iconAnchor: [25, 25]
        });

        this.ambulanceIcon = ambulanceIcon;
        this.touristIcon = touristIcon;

        // Add ambulance pulse animation
        const animStyle = document.createElement('style');
        animStyle.textContent = `
            @keyframes ambulancePulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(animStyle);
    }

    /**
     * Start tracking updates
     */
    startTracking() {
        this.updateTracking();
        this.updateInterval = setInterval(() => this.updateTracking(), 10000);
        this.simulationInterval = setInterval(() => this.simulateMovement(), 10000);
    }

    /**
     * Update tracking data from server
     */
    async updateTracking() {
        try {
            const response = await fetch(`/api/ambulance/track/${this.hospitalReqId}`);
            const data = await response.json();

            console.log('Tracking data received:', data);

            if (data.error) {
                console.error('Tracking error:', data.error);
                return;
            }

            // Update UI
            this.updateUI(data);

            // Update map
            this.updateMap(data);

            // Update timeline
            this.updateTimeline(data.status);

            if (data.status === 'arrived') {
                this.handleArrival();
            }
        } catch (error) {
            console.error('Error updating tracking:', error);
        }
    }

    /**
     * Update timeline based on status
     */
    updateTimeline(status) {
        const steps = ['assigned', 'on_the_way', 'arrived'];
        const currentIndex = steps.indexOf(status);

        steps.forEach((step, index) => {
            const stepEl = document.getElementById(`step-${step}`);
            const connector = stepEl?.nextElementSibling;

            if (index < currentIndex) {
                stepEl?.classList.add('completed');
                stepEl?.classList.remove('active');
                connector?.classList.add('completed');
            } else if (index === currentIndex) {
                stepEl?.classList.add('active');
                stepEl?.classList.remove('completed');
            } else {
                stepEl?.classList.remove('active', 'completed');
                connector?.classList.remove('active', 'completed');
            }
        });

        // Update timestamps
        const now = new Date().toLocaleTimeString();
        if (status === 'assigned') {
            document.getElementById('time-assigned').textContent = now;
        } else if (status === 'on_the_way') {
            document.getElementById('time-dispatched').textContent = now;
        } else if (status === 'arrived') {
            document.getElementById('time-arrived').textContent = now;
        }
    }

    /**
     * Simulate ambulance movement
     */
    async simulateMovement() {
        try {
            const response = await fetch(`/api/ambulance/simulate/${this.hospitalReqId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();
            if (data.status === 'arrived') {
                this.handleArrival();
            }
        } catch (error) {
            console.error('Error simulating movement:', error);
        }
    }

    /**
     * Update UI elements
     */
    updateUI(data) {
        document.getElementById('ambulanceUnit').textContent = data.ambulance_unit || '---';

        const etaElement = document.getElementById('ambulanceETA');
        if (data.eta_minutes > 0) {
            const minText = _tAmb('amb_mins').replace('{n}', data.eta_minutes);
            etaElement.textContent = minText;
        } else {
            etaElement.textContent = _tAmb('amb_arriving_now');
        }

        document.getElementById('ambulanceDistance').textContent = `${data.distance_km.toFixed(2)} km`;
        const lastUpdText = _tAmb('amb_last_updated').replace('{time}', new Date().toLocaleTimeString());
        document.getElementById('lastUpdateTime').textContent = lastUpdText;

        const progress = Math.max(10, 100 - (data.distance_km * 20));
        document.getElementById('trackingProgress').style.width = `${Math.min(progress, 100)}%`;
    }

    /**
     * Update map markers and route
     */
    updateMap(data) {
        if (!this.map) {
            console.warn('Map not initialized yet');
            return;
        }

        // Validate coordinates
        if (!data.ambulance_location || !data.tourist_location) {
            console.error('Missing location data:', data);
            return;
        }

        const ambulanceLoc = [data.ambulance_location.lat, data.ambulance_location.lng];
        const touristLoc = [data.tourist_location.lat, data.tourist_location.lng];

        console.log('Updating map with locations:', { ambulanceLoc, touristLoc });

        // Update or create ambulance marker
        if (this.ambulanceMarker) {
            this.ambulanceMarker.setLatLng(ambulanceLoc);
        } else {
            this.ambulanceMarker = L.marker(ambulanceLoc, { icon: this.ambulanceIcon })
                .addTo(this.map)
                .bindPopup(`<b>${data.ambulance_unit}</b><br>Status: ${data.status}`);
        }

        // Update or create tourist marker
        if (this.touristMarker) {
            this.touristMarker.setLatLng(touristLoc);
        } else {
            this.touristMarker = L.marker(touristLoc, { icon: this.touristIcon })
                .addTo(this.map)
                .bindPopup(`<b>Your Location</b><br>${data.tourist_name}`);
        }

        // Update or create route line
        if (this.routeLine) {
            this.routeLine.setLatLngs([ambulanceLoc, touristLoc]);
        } else {
            this.routeLine = L.polyline([ambulanceLoc, touristLoc], {
                color: '#dc2626',
                weight: 5,
                opacity: 0.7,
                dashArray: '15, 10'
            }).addTo(this.map);
        }

        // Fit map to show both markers with padding
        const bounds = L.latLngBounds([ambulanceLoc, touristLoc]);
        this.map.fitBounds(bounds, {
            padding: [80, 80],
            maxZoom: 15
        });

        // Force map to refresh
        setTimeout(() => {
            if (this.map) {
                this.map.invalidateSize();
            }
        }, 100);
    }

    /**
     * Handle ambulance arrival
     */
    handleArrival() {
        this.stopTracking();

        const arrivalHTML = `
            <div class="alert alert-success m-4" style="border-radius: 12px; border: none; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                <div class="d-flex align-items-center">
                    <div style="font-size: 48px; margin-right: 1rem;">
                        <i class="fas fa-check-circle text-success"></i>
                    </div>
                    <div>
                        <h5 class="alert-heading mb-1">${_tAmb('amb_arrived_title')}</h5>
                        <p class="mb-0">${_tAmb('amb_arrived_desc')}</p>
                    </div>
                </div>
            </div>
        `;

        const modalBody = document.querySelector('#ambulanceTrackingModal .modal-body');
        if (modalBody) {
            modalBody.insertAdjacentHTML('afterbegin', arrivalHTML);
        }

        setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('ambulanceTrackingModal'));
            if (modal) modal.hide();
        }, 10000);
    }

    /**
     * Stop tracking
     */
    stopTracking() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }
    }

    /**
     * Cleanup map and markers
     */
    cleanup() {
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
        this.ambulanceMarker = null;
        this.touristMarker = null;
        this.routeLine = null;
    }
}

// Initialize ambulance tracker
let ambulanceTracker = null;

document.addEventListener('DOMContentLoaded', function () {
    ambulanceTracker = new AmbulanceTracker();

    // Check immediately if there's an active ambulance
    ambulanceTracker.checkForActiveAmbulance();

    // Check for active ambulance every 15 seconds
    setInterval(() => {
        ambulanceTracker.checkForActiveAmbulance();
    }, 15000);
});

// Global function to open tracking from button
function openAmbulanceTracking() {
    if (ambulanceTracker) {
        ambulanceTracker.openTracking();
    }
}
