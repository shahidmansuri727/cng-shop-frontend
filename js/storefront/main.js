/* ==========================================================================
   Detect Scrolling to Hide Navbar Links
   ========================================================================== */
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    
    // If the user scrolls down more than 50 pixels
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled'); // Hide links
    } else {
        navbar.classList.remove('scrolled'); // Show links again at the top
    }
});
/* ==========================================================================
   1. STOREFRONT GLOBAL LOGIC (Navigation & Mobile Menu)
   ========================================================================== */

// Ensures the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log("AutoGas Solutions Storefront Loaded.");
    
    // Smooth scrolling for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

/* ==========================================================================
   2. QUOTE MODAL SYSTEM (Used on kits.html)
   ========================================================================== */

// This dynamically creates the HTML for the Quote Form only when needed
function createQuoteModalHTML() {
    const modalHTML = `
        <div id="quoteModalOverlay" class="overlay hidden">
            <div class="modal">
                <div class="modal-content">
                    <div class="modal-header flex-between">
                        <h2>Get Quote for <span id="quoteKitName" class="text-success"></span></h2>
                        <span class="close-btn" onclick="closeQuoteModal()">&times;</span>
                    </div>
                    <div class="modal-body">
                        <p style="margin-bottom: 20px; font-size: 0.9rem; color: #7f8c8d;">
                            Provide your car details and we will send you an exact price via WhatsApp.
                        </p>
                        <form id="quoteForm" onsubmit="submitQuoteRequest(event)">
                            <div class="input-group">
                                <label>Car Make & Model</label>
                                <input type="text" id="carModel" placeholder="e.g. Hyundai i20 (2020)" required>
                            </div>
                            <div class="input-group">
                                <label>WhatsApp Number</label>
                                <input type="tel" id="customerPhone" placeholder="+91" pattern="[0-9]{10}" required>
                            </div>
                            <button type="submit" class="btn btn-primary full-width" style="margin-top: 10px;">
                                Send Request via WhatsApp
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Inject it at the bottom of the body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Opens the Quote Modal and sets the specific Kit Name
function openQuoteModal(kitName) {
    // If the modal doesn't exist in the document yet, create it
    if (!document.getElementById('quoteModalOverlay')) {
        createQuoteModalHTML();
    }
    
    // Set the kit name dynamically
    document.getElementById('quoteKitName').innerText = kitName;
    
    // Show the modal
    document.getElementById('quoteModalOverlay').classList.remove('hidden');
}

// Closes the Quote Modal
function closeQuoteModal() {
    const modal = document.getElementById('quoteModalOverlay');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Handles the submission of the quote
function submitQuoteRequest(event) {
    event.preventDefault(); // Prevents the page from refreshing
    
    const kitName = document.getElementById('quoteKitName').innerText;
    const carModel = document.getElementById('carModel').value;
    const phone = document.getElementById('customerPhone').value;
    
    // In Phase 2, this will send a POST request to your Node.js backend.
    // For Phase 1, we can actually open a direct WhatsApp chat to your business number!
    
    const businessWhatsAppNumber = "919876543210"; // Replace with your actual shop number
    const message = `Hello AutoGas! I want a final quote for the *${kitName}*. My car is a ${carModel} and my number is ${phone}.`;
    const whatsappURL = `https://wa.me/${businessWhatsAppNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappURL, '_blank');
    
    // Close the modal and clear the form
    closeQuoteModal();
    document.getElementById('quoteForm').reset();
}

/* ==========================================================================
   3. SERVICE BOOKING MODAL (Used on services.html)
   ========================================================================== */

function openBookingForm() {
    // We can reuse the exact same dynamic logic here for booking appointments.
    // For now, it triggers a simple native browser prompt.
    
    let userAction = confirm("Would you like to chat with our workshop manager on WhatsApp to book your slot?");
    if(userAction) {
        const businessWhatsAppNumber = "919876543210"; 
        const message = "Hello AutoGas, I would like to book a service/hydro-test appointment.";
        window.open(`https://wa.me/${businessWhatsAppNumber}?text=${encodeURIComponent(message)}`, '_blank');
    }
}