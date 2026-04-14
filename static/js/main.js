/**
 * Main JavaScript - Dark Mode & Toast Notifications
 */

// ============== DARK MODE TOGGLE ==============
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            showToast(`Switched to ${newTheme} mode`, 'success');
        });
    }
    
    function updateThemeIcon(theme) {
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'light' 
                ? '<i class="fas fa-moon"></i>' 
                : '<i class="fas fa-sun"></i>';
        }
    }
});

// ============== TOAST NOTIFICATIONS ==============
function showToast(message, type = 'info') {
    const toastEl = document.getElementById('liveToast');
    if (!toastEl) return;
    
    const toastBody = toastEl.querySelector('.toast-body');
    const toastHeader = toastEl.querySelector('.toast-header');
    
    // Set message
    toastBody.textContent = message;
    
    // Set color based on type
    const iconClass = {
        'success': 'fa-check-circle text-success',
        'danger': 'fa-exclamation-triangle text-danger',
        'warning': 'fa-exclamation-circle text-warning',
        'info': 'fa-info-circle text-primary'
    }[type] || 'fa-info-circle text-primary';
    
    const icon = toastHeader.querySelector('i');
    if (icon) {
        icon.className = `fas ${iconClass} me-2`;
    }
    
    // Show toast
    const toast = new bootstrap.Toast(toastEl, {
        autohide: true,
        delay: 4000
    });
    toast.show();
}

// ============== SIDEBAR TOGGLE (MOBILE) ==============
document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.add('mobile-open');
            if (mobileOverlay) {
                mobileOverlay.classList.add('active');
            }
        });
        
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', function() {
                sidebar.classList.remove('mobile-open');
                mobileOverlay.classList.remove('active');
            });
        }
    }
});

// ============== UTILITY FUNCTIONS ==============
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
}

// Make showToast available globally
window.showToast = showToast;
