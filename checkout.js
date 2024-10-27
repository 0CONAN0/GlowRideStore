// Load cart items from Local Storage and display them on the checkout page
document.addEventListener("DOMContentLoaded", function () {
    const cart = JSON.parse(localStorage.getItem("cartForCheckout")) || [];
    const orderSummaryContainer = document.querySelector(".order-summary-items");
    let total = 0;

    if (cart.length === 0) {
        orderSummaryContainer.innerHTML = "<p>Your cart is empty. Go back to add items.</p>";
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const summaryItem = document.createElement("div");
            summaryItem.classList.add("summary-item");
            summaryItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <p>${item.name}</p>
                    <p>Price: $${item.price.toFixed(2)}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Total: $${itemTotal.toFixed(2)}</p>
                </div>
            `;
            orderSummaryContainer.appendChild(summaryItem);
        });

        document.getElementById("checkout-total").textContent = `$${total.toFixed(2)}`;
    }
});
