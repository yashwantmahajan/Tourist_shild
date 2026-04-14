// JavaScript functions for admin dashboard

/** Tiny translation helper — works alongside hi.js */
function _t(key) {
    try {
        const lang = localStorage.getItem('ts_lang') || 'en';
        return (window.TRANSLATIONS && window.TRANSLATIONS[lang] && window.TRANSLATIONS[lang][key])
            ? window.TRANSLATIONS[lang][key]
            : (window.TRANSLATIONS && window.TRANSLATIONS['en'] && window.TRANSLATIONS['en'][key])
                ? window.TRANSLATIONS['en'][key]
                : key;
    } catch (e) { return key; }
}

// View Tourist Details Modal
function viewTouristDetails(touristId, name, digitalId) {
    // Create modal if it doesn't exist
    if (!document.getElementById('touristDetailsModal')) {
        const modalHTML = `
        <div class="modal fade" id="touristDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${_t('modal_tourist_details')}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" id="touristDetailsContent">
                        <div class="text-center">
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">${_t('modal_loading')}</span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${_t('modal_close')}</button>
                    </div>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    } else {
        // update title in case language changed
        const titleEl = document.querySelector('#touristDetailsModal .modal-title');
        if (titleEl) titleEl.textContent = _t('modal_tourist_details');
        const closeBtn = document.querySelector('#touristDetailsModal .modal-footer .btn-secondary');
        if (closeBtn) closeBtn.textContent = _t('modal_close');
    }

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('touristDetailsModal'));
    modal.show();

    // Fetch tourist details
    fetch(`/api/admin/tourist/${touristId}/details`)
        .then(response => response.json())
        .then(data => {
            const safetyColor = data.safety_score >= 80 ? 'success' : (data.safety_score >= 50 ? 'warning' : 'danger');
            document.getElementById('touristDetailsContent').innerHTML = `
                <div class="row g-3">
                    <div class="col-md-6">
                        <strong>${_t('modal_lbl_name')}</strong> ${data.name}
                    </div>
                    <div class="col-md-6">
                        <strong>${_t('modal_lbl_digital_id')}</strong> ${data.digital_id}
                    </div>
                    <div class="col-md-6">
                        <strong>${_t('modal_lbl_type')}</strong> ${data.tourist_type || 'N/A'}
                    </div>
                    <div class="col-md-6">
                        <strong>${_t('modal_lbl_nationality')}</strong> ${data.nationality || 'N/A'}
                    </div>
                    <div class="col-md-6">
                        <strong>${_t('modal_lbl_contact')}</strong> ${data.contact || 'N/A'}
                    </div>
                    <div class="col-md-6">
                        <strong>${_t('modal_lbl_safety')}</strong> <span class="badge bg-${safetyColor}">${data.safety_score}%</span>
                    </div>
                    <div class="col-md-6">
                        <strong>${_t('modal_lbl_status')}</strong> ${data.status}
                    </div>
                    <div class="col-md-6">
                        <strong>${_t('modal_lbl_last_location')}</strong> ${data.last_location}
                    </div>
                    <div class="col-12">
                        <hr>
                        <h6>${_t('modal_lbl_actions')}</h6>
                        <a href="/api/admin/tourist/${touristId}/download-info" class="btn btn-success">
                            <i class="fas fa-download me-2"></i>${_t('modal_download_report')}
                        </a>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            document.getElementById('touristDetailsContent').innerHTML = `
                <div class="alert alert-danger">
                    ${_t('modal_error')}
                </div>
            `;
        });
}

// Dispatch hospital/ambulance
function dispatchHospital(hospitalId) {
    console.log('Dispatch button clicked for hospital ID:', hospitalId);

    if (confirm(_t('dispatch_confirm_amb'))) {
        console.log('Dispatching ambulance...');

        fetch(`/api/admin/dispatch/hospital/${hospitalId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                console.log('Response status:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data);
                alert(data.message || _t('dispatch_ambulance'));
                location.reload();
            })
            .catch(error => {
                console.error('Dispatch error:', error);
                alert('Error dispatching ambulance: ' + error.message);
            });
    } else {
        console.log('Dispatch cancelled by user');
    }
}

// Make functions globally available
window.viewTouristDetails = viewTouristDetails;
window.dispatchHospital = dispatchHospital;
