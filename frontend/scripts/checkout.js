console.log("Checkout page loaded successfully!");

// =============================
// LOAD CART
// =============================

const cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

const checkoutItems =
    document.getElementById(
        "checkout-items"
    );

const subtotalElement =
    document.getElementById(
        "checkout-subtotal"
    );

const taxElement =
    document.getElementById(
        "checkout-tax"
    );

const totalElement =
    document.getElementById(
        "checkout-total"
    );

// =============================
// RENDER SUMMARY
// =============================

function renderCheckout(){

    checkoutItems.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item) => {

        const price =
            parseInt(
                item.price.replace(/\D/g, "")
            );

        subtotal +=
            price * item.qty;

        const div =
            document.createElement("div");

        div.classList.add(
            "checkout-item"
        );

        div.innerHTML = `
            <span>
                ${item.name}
                (${item.qty})
            </span>

            <span>
                ₹${price * item.qty}
            </span>
        `;

        checkoutItems.appendChild(div);

    });

    const tax =
        subtotal * 0.18;

    const total =
        subtotal + tax;

    subtotalElement.innerText =
        `₹${subtotal}`;

    taxElement.innerText =
        `₹${tax.toFixed(2)}`;

    totalElement.innerText =
        `₹${total.toFixed(2)}`;

}

renderCheckout();

// =============================
// PAYMENT METHOD TOGGLE
// =============================

const paymentMethods =
    document.querySelectorAll(
        'input[name="payment"]'
    );

const cardDetails =
    document.getElementById(
        "card-details"
    );

paymentMethods.forEach((method) => {

    method.addEventListener(
        "change",
        () => {

            if(method.value === "Card"){

                cardDetails.style.display =
                    "block";

            }else{

                cardDetails.style.display =
                    "none";

            }

        }
    );

});

// =============================
// PLACE ORDER
// =============================

const checkoutForm =
    document.getElementById(
        "checkout-form"
    );

checkoutForm.addEventListener(
    "submit",
    (e) => {

        e.preventDefault();

        if(cart.length === 0){

            alert("Your cart is empty!");

            return;

        }

        const orders =
            JSON.parse(
                localStorage.getItem(
                    "orders"
                )
            ) || [];

        const order = {

            id:
                "ORD-" +
                Date.now(),

            date:
                new Date()
                .toLocaleString(),

            items: cart

        };

        orders.push(order);

        localStorage.setItem(
            "orders",
            JSON.stringify(orders)
        );

        localStorage.removeItem(
            "cart"
        );

        alert(
            "Order placed successfully!"
        );

        window.location.href =
            "dashboard.html#orders";

    }
);