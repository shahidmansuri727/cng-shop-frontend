/* ==========================================================================
   CRM & VEHICLE MANAGEMENT LOGIC (Used on customers.html)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("CRM Module Initialized.");

    // Attach event listener for the search bar
    const searchInput = document.getElementById('customerSearch');
    if (searchInput) {
        searchInput.addEventListener('keyup', filterCustomerTable);
    }

    // Attach event listener for the status dropdown
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterCustomerTable);
    }
});

/* ==========================================================================
   MODAL CONTROL
   ========================================================================== */

function openAddCustomerModal() {
    const modal = document.getElementById('addCustomerModal');
    const overlay = document.getElementById('modalOverlay');
    
    if (modal && overlay) {
        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
        
        // Automatically set the installation date to today's date
        const today = new Date();
        const dateInput = document.getElementById('installDateInput');
        
        if(dateInput) {
            // Format to YYYY-MM-DD for the HTML date input
            dateInput.value = today.toISOString().split('T')[0];
            // Trigger the expiry calculation immediately
            calculateExpiry();
        }
    }
}

function closeAddCustomerModal() {
    document.getElementById('addCustomerModal').classList.add('hidden');
    document.getElementById('modalOverlay').classList.add('hidden');
    document.getElementById('newInstallationForm').reset();
    
    // Reset the calculated date display
    document.getElementById('displayExpiryDate').innerText = "--/--/----";
}

/* ==========================================================================
   THE 3-YEAR AUTOMATION LOGIC
   ========================================================================== */

function calculateExpiry() {
    const installInput = document.getElementById('installDateInput').value;
    if (!installInput) return;

    // 1. Create a date object from the selected installation date
    const installDate = new Date(installInput);
    
    // 2. Add exactly 3 years to that date
    const expiryDate = new Date(installDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 3);

    // 3. Format the date for the Indian UI (e.g., 14 Aug 2029)
    const displayOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedExpiry = expiryDate.toLocaleDateString('en-IN', displayOptions);
    
    // 4. Update the UI
    document.getElementById('displayExpiryDate').innerText = formattedExpiry;
    
    // 5. Save the raw format in a hidden field. 
    // This is the EXACT value that will be sent to your Node.js/MySQL database.
    document.getElementById('hiddenExpiryDate').value = expiryDate.toISOString();
}

function submitNewCustomer() {
    // 1. In a real application, you would gather all form data here
    const form = document.getElementById('newInstallationForm');
    
    // Basic validation check
    if (!form.checkValidity()) {
        alert("Please fill in all required fields (Name, Phone, Car Model, RC, Kit).");
        return;
    }

    // 2. Phase 2: Send to backend
    // fetch('/api/customers/new', { method: 'POST', body: formData })
    
    // 3. Success Feedback
    alert("Success!\n\nCustomer registered, vehicle linked, and the 3-Year Hydro-Test countdown has officially started in the system.");
    closeAddCustomerModal();
}

/* ==========================================================================
   TABLE SEARCH & FILTERING
   ========================================================================== */

function filterCustomerTable() {
    const searchQuery = document.getElementById('customerSearch').value.toLowerCase();
    const statusQuery = document.getElementById('statusFilter').value;
    const tableRows = document.querySelectorAll('.admin-table tbody tr');

    tableRows.forEach(row => {
        const textContent = row.innerText.toLowerCase();
        let matchesSearch = textContent.includes(searchQuery);
        let matchesStatus = true;

        // Check dropdown status (Active, Expiring, Expired)
        if (statusQuery !== 'all') {
            const badge = row.querySelector('.status-badge');
            if (badge) {
                const badgeClass = badge.className;
                if (statusQuery === 'active' && !badgeClass.includes('success')) matchesStatus = false;
                if (statusQuery === 'expiring' && !badgeClass.includes('warning')) matchesStatus = false;
                if (statusQuery === 'expired' && !badgeClass.includes('danger')) matchesStatus = false;
            }
        }

        // Show or hide the row based on the filters
        if (matchesSearch && matchesStatus) {
            row.style.display = ''; // Show row
        } else {
            row.style.display = 'none'; // Hide row
        }
    });
}