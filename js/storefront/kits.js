/* ==========================================================================
   KIT CATALOG FILTERING LOGIC (Used on kits.html)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Kits Filter Module Initialized.");

    // Select all checkboxes in the sidebar that are used for filtering
    const filterCheckboxes = document.querySelectorAll('.sidebar-filters input[type="checkbox"]');

    // Attach an event listener to each checkbox so it triggers the filter when clicked
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });
});

function filterProducts() {
    // 1. Gather all currently checked Kit Types
    const selectedTypes = Array.from(document.querySelectorAll('.filter-group input[data-filter="type"]:checked'))
        .map(cb => cb.value);

    // 2. Gather all currently checked Brands
    const selectedBrands = Array.from(document.querySelectorAll('.filter-group input[data-filter="brand"]:checked'))
        .map(cb => cb.value);

    // 3. Get all product cards in the grid
    const productCards = document.querySelectorAll('.kit-card');

    productCards.forEach(card => {
        // Read the custom data attributes from the HTML
        const cardType = card.getAttribute('data-type');
        const cardBrand = card.getAttribute('data-brand');

        // 4. Determine if the card matches the selected filters
        // If an array is empty (length === 0), it means no checkboxes in that category are ticked, 
        // so we default to showing everything in that category.
        const matchesType = (selectedTypes.length === 0) || selectedTypes.includes(cardType);
        const matchesBrand = (selectedBrands.length === 0) || selectedBrands.includes(cardBrand);

        // 5. Update the UI to show or hide the card
        if (matchesType && matchesBrand) {
            card.style.display = ""; // Show card (reverts to default CSS display)
        } else {
            card.style.display = "none"; // Hide card completely
        }
    });
}
import { db } from '../js/firebase-config.js'; // Adjust path depending on file location
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-firestore.js";

const kitForm = document.getElementById('addKitForm');

if (kitForm) {
    kitForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Grab values from the form
        const name = document.getElementById('kitName').value;
        const brand = document.getElementById('kitBrand').value;
        const price = parseFloat(document.getElementById('kitPrice').value);
        const details = document.getElementById('kitDetails').value;

        try {
            // Add a new document to the "kits" collection in Firestore
            await addDoc(collection(db, "kits"), {
                name: name,
                brand: brand,
                price: price,
                details: details,
                createdAt: new Date()
            });

            alert('Kit successfully added to N.S. Motors database!');
            kitForm.reset(); // Clear the form
        } catch (error) {
            console.error("Error adding kit: ", error);
            alert('Failed to save kit. Check console for details.');
        }
    });
}
import { db } from '../js/firebase-config.js';
import { collection, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-firestore.js";

async function loadAdminInventory() {
    const inventoryContainer = document.querySelector('.website-system-quick-controls ~ div') || document.getElementById('adminKitList');
    if (!inventoryContainer) return;

    try {
        const querySnapshot = await getDocs(collection(db, "kits"));
        
        // Clear old static list or build dynamic HTML
        let htmlContent = '<h3 class="mb-4">Live Database Inventory (N.S. Motors)</h3>';

        if (querySnapshot.empty) {
            htmlContent += '<p>No kits found in the cloud database.</p>';
        } else {
            querySnapshot.forEach((kitDoc) => {
                const kit = kitDoc.data();
                const docId = kitDoc.id;

                htmlContent += `
                    <div class="d-flex justify-content-between align-items-center p-3 mb-2 bg-white shadow-sm rounded border">
                        <div>
                            <h5 class="mb-1 text-primary">${kit.name}</h5>
                            <p class="mb-1 text-muted small">Brand: ${kit.brand} | Price: ₹${kit.price}</p>
                            <span class="badge bg-success">Live on Firebase</span>
                        </div>
                        <div>
                            <button class="btn btn-danger btn-sm" onclick="deleteKit('${docId}')">Delete</button>
                        </div>
                    </div>
                `;
            });
        }

        // Re-inject the live inventory list into your dashboard view
        // (You can target a specific container div ID if preferred)
        console.log("Loaded live inventory from Firebase successfully.");
    } catch (error) {
        console.error("Error fetching inventory from Firebase: ", error);
    }
}

// Global function to delete a kit from Firebase
window.deleteKit = async function(docId) {
    if (confirm("Are you sure you want to delete this kit from N.S. Motors database?")) {
        try {
            await deleteDoc(doc(db, "kits", docId));
            alert("Kit deleted successfully.");
            location.reload();
        } catch (error) {
            console.error("Error deleting kit: ", error);
            alert("Failed to delete kit.");
        }
}
};

// Run on page load
document.addEventListener('DOMContentLoaded', loadAdminInventory);