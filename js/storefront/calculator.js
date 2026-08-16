/* ==========================================================================
   js/storefront/calculator.js - CNG Savings Calculator Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Select the calculator input fields and result display
    const dailyKm = document.getElementById('dailyKm');
    const petrolPrice = document.getElementById('petrolPrice');
    const cngPrice = document.getElementById('cngPrice');
    const resultDisplay = document.getElementById('savings-result');

    // Only execute the script if the calculator elements exist on the current page
    if (dailyKm && petrolPrice && cngPrice && resultDisplay) {
        
        function calculateSavings() {
            // Parse the input values, defaulting to 0 if left blank
            const km = parseFloat(dailyKm.value) || 0;
            const pPrice = parseFloat(petrolPrice.value) || 0;
            const cPrice = parseFloat(cngPrice.value) || 0;

            // Average mileage assumptions for calculations
            const petrolMileage = 15; // km per litre
            const cngMileage = 20;    // km per kg

            // Daily cost calculations
            const petrolCostPerDay = (km / petrolMileage) * pPrice;
            const cngCostPerDay = (km / cngMileage) * cPrice;

            // Total savings calculations
            const dailySavings = petrolCostPerDay - cngCostPerDay;
            const monthlySavings = dailySavings * 30;

            // Update the UI dynamically
            if (monthlySavings > 0) {
                // Formats the number with Indian commas (e.g., 4,500)
                resultDisplay.innerText = "₹ " + Math.round(monthlySavings).toLocaleString('en-IN') + " / month";
                resultDisplay.style.color = "var(--eco-green)";
            } else {
                resultDisplay.innerText = "₹ 0 / month";
                resultDisplay.style.color = "var(--text-muted)";
            }
        }

        // Listen for the user typing to update the math instantly
        dailyKm.addEventListener('input', calculateSavings);
        petrolPrice.addEventListener('input', calculateSavings);
        cngPrice.addEventListener('input', calculateSavings);
        
        // Run an initial calculation when the page first loads
        calculateSavings();
    }
});