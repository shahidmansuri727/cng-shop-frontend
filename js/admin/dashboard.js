/* ==========================================================================
   ADMIN DASHBOARD LOGIC (Used on dashboard.html)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin Dashboard Initialized.");
    
    // 1. Set the current date in the top bar
    setCurrentDate();

    // 2. Initialize any dynamic dashboard widgets
    initializeDashboardWidgets();
});

/* ==========================================================================
   UI & WIDGET UPDATES
   ========================================================================== */

function setCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        // Use 'en-IN' to ensure formatting matches Indian standards
        dateElement.innerText = new Date().toLocaleDateString('en-IN', dateOptions);
    }
}

function initializeDashboardWidgets() {
    // In Phase 2, this function will make a fetch() call to your Node.js backend
    // to get the real-time count of active installations and monthly revenue.
    // fetch('/api/admin/kpis').then(data => updateKpiDOM(data));
    console.log("Widgets ready for backend data integration.");
}

/* ==========================================================================
   WHATSAPP AUTOMATION & ALERTS
   ========================================================================== */

/**
 * Triggers a WhatsApp alert to a customer whose 3-year hydro-test is expiring.
 * @param {string} phone - Customer's 10-digit phone number
 * @param {string} name - Customer's name
 * @param {HTMLElement} btnElement - The button that was clicked (to update UI)
 */
function triggerWhatsApp(phone, name, btnElement) {
    // 1. Format the standard alert message
    const businessName = "AutoGas Solutions Visnagar";
    const message = `⚠️ *URGENT COMPLIANCE ALERT* ⚠️\n\nDear ${name},\n\nThe mandatory 3-year RTO hydro-test for your CNG cylinder is expiring in less than 7 days.\n\nPlease bring your vehicle to ${businessName} immediately to avoid RTO fines and ensure your safety.\n\nReply to this message to book your slot.`;
    
    // 2. Open WhatsApp API in a new tab (Fallback for manual trigger)
    // In Phase 2, this will be replaced by a background POST request to a service like Wati or Interakt.
    const whatsappURL = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');

    // 3. Update the UI to show the alert was handled
    if (btnElement) {
        // Change the button appearance
        btnElement.innerText = "Alert Sent ✓";
        btnElement.classList.remove('btn-secondary');
        btnElement.classList.add('btn-outline');
        btnElement.disabled = true;

        // Find the adjacent status badge and update it
        const actionContainer = btnElement.parentElement;
        const badge = actionContainer.querySelector('.status-badge');
        if (badge) {
            badge.className = "status-badge success";
            badge.innerText = "Alert Sent Today";
        }
    }
}

/* ==========================================================================
   NAVIGATION HELPERS
   ========================================================================== */

function createNewBill() {
    // Navigates the admin directly to the billing page and automatically opens the modal
    // We append a query parameter so billing.js knows to open the modal immediately
    window.location.href = "billing.html?action=new_bill";
}