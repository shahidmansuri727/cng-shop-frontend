/* ==========================================================================
   API COMMUNICATION BRIDGE (The link between Frontend and Node.js Backend)
   ========================================================================== */

// For Phase 2 development, your Node.js server will likely run on port 3000
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Core function to handle all network requests to your Node.js server.
 * It automatically handles JSON formatting, headers, and security tokens.
 */
async function apiRequest(endpoint, method = 'GET', data = null) {
    // 1. Set up the headers
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    // If an admin or customer is logged in, grab their secure token
    const token = localStorage.getItem('autogas_auth_token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // 2. Configure the fetch options
    const config = {
        method: method,
        headers: headers
    };

    if (data && (method === 'POST' || method === 'PUT')) {
        config.body = JSON.stringify(data);
    }

    // 3. Make the actual network call to Node.js
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        // Parse the JSON response from the server
        const responseData = await response.json();

        if (!response.ok) {
            // Handle errors (like incorrect passwords or server crashes)
            console.error(`API Error [${response.status}]:`, responseData.message);
            throw new Error(responseData.message || 'Something went wrong on the server.');
        }

        return responseData;

    } catch (error) {
        console.error('Network Failure:', error);
        alert(`Connection Error: ${error.message}`);
        return null;
    }
}

/* ==========================================================================
   READY-TO-USE ENDPOINTS (To be activated in Phase 2)
   ========================================================================== */

// We attach these to the global 'window' object so all your other scripts 
// (like crm.js and billing.js) can easily call them.

window.AutoGasAPI = {
    
    // --- AUTHENTICATION ---
    auth: {
        adminLogin: async (email, password) => {
            return await apiRequest('/admin/login', 'POST', { email, password });
        },
        customerRequestOTP: async (phone) => {
            return await apiRequest('/customer/request-otp', 'POST', { phone });
        },
        customerVerifyOTP: async (phone, otp) => {
            return await apiRequest('/customer/verify-otp', 'POST', { phone, otp });
        }
    },

    // --- CUSTOMERS & VEHICLES (CRM) ---
    crm: {
        getAllCustomers: async () => {
            return await apiRequest('/customers', 'GET');
        },
        addNewInstallation: async (customerData) => {
            // customerData will include name, phone, car model, kit type, and expiry date
            return await apiRequest('/customers/new', 'POST', customerData);
        },
        getExpiringRenewals: async () => {
            // Fetches customers whose 3-year hydro-test is due in the next 30 days
            return await apiRequest('/customers/expiring', 'GET');
        }
    },

    // --- BILLING & INVOICING ---
    billing: {
        createInvoice: async (invoiceData) => {
            return await apiRequest('/invoices/create', 'POST', invoiceData);
        },
        sendWhatsAppBill: async (invoiceId) => {
            // Triggers the Node.js server to fire the external WhatsApp API
            return await apiRequest(`/invoices/${invoiceId}/send-whatsapp`, 'POST');
        }
    }
};