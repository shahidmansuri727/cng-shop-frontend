/* ==========================================================================
   INVOICING & BILLING LOGIC (Used on billing.html)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Billing Module Initialized.");

    // Check if we arrived here from the dashboard's "+ New Bill" button
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'new_bill') {
        openInvoiceModal();
    }
});

/* ==========================================================================
   MODAL CONTROL
   ========================================================================== */

function openInvoiceModal() {
    const modal = document.getElementById('invoiceModal');
    const overlay = document.getElementById('modalOverlay');
    
    if(modal && overlay) {
        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
        // Ensure today's date is set by default
        document.getElementById('invoiceDate').valueAsDate = new Date();
    }
}

function closeInvoiceModal() {
    document.getElementById('invoiceModal').classList.add('hidden');
    document.getElementById('modalOverlay').classList.add('hidden');
}

/* ==========================================================================
   DYNAMIC ITEM ROWS & CALCULATIONS
   ========================================================================== */

function addRow() {
    const tbody = document.getElementById('invoiceItemsBody');
    
    // Create a new table row element
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>
            <input type="text" class="item-desc" placeholder="Item description / Service" required>
        </td>
        <td>
            <input type="number" class="item-qty" value="1" min="1" oninput="calculateTotals()">
        </td>
        <td>
            <input type="number" class="item-rate" value="0" min="0" oninput="calculateTotals()">
        </td>
        <td class="item-row-total-container">
            <span class="item-row-total">0</span>
            <button type="button" class="action-btn alert-btn delete-row-btn" onclick="removeRow(this)" title="Remove Item">&times;</button>
        </td>
    `;
    
    tbody.appendChild(tr);
    
    // Adding a slight animation or focus could go here to improve UX
    const newDescInput = tr.querySelector('.item-desc');
    if (newDescInput) newDescInput.focus();
}

function removeRow(buttonElement) {
    // Traverse up the DOM to find the parent <tr> and remove it
    const row = buttonElement.closest('tr');
    if (row) {
        row.remove();
        // Recalculate totals after a row is removed
        calculateTotals();
    }
}

function calculateTotals() {
    let subtotal = 0;
    const rows = document.querySelectorAll('#invoiceItemsBody tr');
    
    rows.forEach(row => {
        const qtyInput = row.querySelector('.item-qty');
        const rateInput = row.querySelector('.item-rate');
        const rowTotalDisplay = row.querySelector('.item-row-total');
        
        // Parse inputs, default to 0 if empty/invalid
        const qty = parseFloat(qtyInput.value) || 0;
        const rate = parseFloat(rateInput.value) || 0;
        
        const rowTotal = qty * rate;
        
        // Update the row total text
        if(rowTotalDisplay) {
            rowTotalDisplay.innerText = rowTotal.toLocaleString('en-IN');
        }
        
        subtotal += rowTotal;
    });

    // Format final currency values for the Indian market
    const formattedSubtotal = "₹ " + subtotal.toLocaleString('en-IN');
    
    // Update the DOM elements
    document.getElementById('subtotalAmount').innerText = formattedSubtotal;
    document.getElementById('grandTotalAmount').innerText = formattedSubtotal;
}

/* ==========================================================================
   BILL GENERATION & DISPATCH
   ========================================================================== */

function generatePDF() {
    // In Phase 2, this will send the form data to Node.js, which will use 
    // a library like 'Puppeteer' or 'PDFKit' to generate a secure, branded PDF.
    
    const customer = document.getElementById('customerSelect').options[document.getElementById('customerSelect').selectedIndex].text;
    const total = document.getElementById('grandTotalAmount').innerText;
    
    alert(`Draft PDF generated for ${customer}.\nTotal: ${total}\n\n(This will download the PDF file in the final version).`);
}

function generateAndSend() {
    // 1. Gather basic validation
    const customerSelect = document.getElementById('customerSelect');
    if(customerSelect.value === "") {
        alert("Please select a customer to bill.");
        return;
    }

    const customerName = customerSelect.options[customerSelect.selectedIndex].text;
    const total = document.getElementById('grandTotalAmount').innerText;

    // 2. Simulate API Dispatch
    // In the final build, this will trigger the WhatsApp Business API 
    // to send a template message containing a secure link to the PDF invoice.
    
    alert(`Success!\n\nInvoice generated and dispatched to ${customerName}'s WhatsApp.\nThe message includes the PDF link and payment options for ${total}.`);
    
    // 3. Reset form and close
    document.getElementById('newInvoiceForm').reset();
    calculateTotals(); // Reset totals back to 0
    closeInvoiceModal();
}

/**
 * Resends a previously generated bill to a customer via WhatsApp
 * Used by the buttons in the "Recent Invoices" table
 */
function sendWhatsAppBill(name, invNumber) {
    const confirmSend = confirm(`Resend invoice ${invNumber} to ${name} via WhatsApp?`);
    if(confirmSend) {
        // Mock API call
        alert(`WhatsApp successfully sent to ${name} with link to Invoice ${invNumber}.`);
    }
}