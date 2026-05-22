console.log("Checkout page loaded successfully!");
const API_BASE = "http://localhost:5000/api";

// LOAD CART
const notify = (message, type = "info") => {
    if (typeof showToast === "function") {
        showToast(message, type);
    } else {
        alert(message);
    }
};
const cart = JSON.parse(localStorage.getItem("cart")) || [];

if(cart.length === 0){
    notify("Your cart is empty!", "error");
    window.location.href = "cart.html";
}

const checkoutItems = document.getElementById("checkout-items");
const subtotalElement = document.getElementById("checkout-subtotal");
const taxElement = document.getElementById("checkout-tax");
const totalElement = document.getElementById("checkout-total");

// RENDER SUMMARY
function renderCheckout(){
    if (!checkoutItems) return;

    checkoutItems.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item) => {
        const price =
            parseFloat(item.price) || 0;
        subtotal += price * item.qty;

        const div = document.createElement("div");
        div.classList.add("checkout-item");
        div.innerHTML = `
            <span>${item.name} (${item.qty})</span>
            <span>₹${price * item.qty}</span>
        `;
        checkoutItems.appendChild(div);
    });

    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    if (subtotalElement) {
        subtotalElement.innerText =
            `₹${subtotal}`;
    }

    if (taxElement) {
        taxElement.innerText =
            `₹${tax.toFixed(2)}`;
    }

    if (totalElement) {
        totalElement.innerText =
            `₹${total.toFixed(2)}`;
    }
}

renderCheckout();

// PAYMENT METHOD TOGGLE
const paymentMethods = document.querySelectorAll('input[name="payment"]');
const cardDetails = document.getElementById("card-details");

paymentMethods.forEach((method) => {
    method.addEventListener("change", () => {
        if (cardDetails) {
            cardDetails.style.display =
                method.value === "Card"
                    ? "block"
                    : "none";
        }
    });
});

// PLACE ORDER
const checkoutForm = document.getElementById("checkout-form");

if (checkoutForm) {
checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if(cart.length === 0){
        notify("Your cart is empty!", "error");
        return;
    }

    const selectedPayment =
        document.querySelector(
            'input[name="payment"]:checked'
        );

    if (!selectedPayment) {
        notify(
            "Select a payment method",
            "error"
        );
        return;
    }

    const order = {
        customer: {
            name: document.getElementById("full-name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value
        },
        address: {
            city: document.getElementById("city").value,
            state: document.getElementById("state").value,
            zip: document.getElementById("zip").value,
            fullAddress: document.getElementById("address").value
        },
        paymentMethod:
            selectedPayment.value,
        items: cart,
        total: totalElement
            ? parseFloat(
                totalElement.innerText.replace(
                    /[^\d\.]/g,
                    ""
                )
              )
            : 0
    };

    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(order)
        });

        const data = await res.json();
        if(data.success){
            notify(
                "Order placed successfully! 🎉",
                "success"
            );
            localStorage.removeItem("cart");
            window.location.href = "order.html";
        } else {
            notify(
                data.message ||
                "Failed to place order",
                "error"
            );
        }

    } catch(error){
        console.error(error);
        notify(
            "Failed to place order",
            "error"
        );
    }
});
}