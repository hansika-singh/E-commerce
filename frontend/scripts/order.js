console.log("Order tracking page loaded successfully!");

// LOAD ORDERS
const orders =
    JSON.parse(
        localStorage.getItem(
            "orders"
        )
    ) || [];

// GET LATEST ORDER
const latestOrder =
    orders[orders.length - 1];

// REDIRECT IF NO ORDER
if(!latestOrder){
    window.location.href =
        "shop.html";

}

// ELEMENTS
const orderItemsContainer =
    document.getElementById(
        "order-items-container"
    );

// RENDER ORDER INFO
const orderIdElement =
    document.getElementById(
        "order-id"
    );

const orderDateElement =
    document.getElementById(
        "order-date"
    );

if (orderIdElement) {
    orderIdElement.innerText =
        latestOrder.id || "N/A";
}

if (orderDateElement) {
    orderDateElement.innerText =
        latestOrder.date || "N/A";
}

// STATUS
const status =
    latestOrder.status ||
    "Pending";

const statusBadge =
    document.getElementById(
        "status-badge"
    );

if (statusBadge) {
    statusBadge.innerText =
        status;
}

// TIMELINE
const processingStep =
    document.getElementById(
        "processing-step"
    );

const shippedStep =
    document.getElementById(
        "shipped-step"
    );

const deliveredStep =
    document.getElementById(
        "delivered-step"
    );
if (
    status === "Processing" ||
    status === "Shipped" ||
    status === "Delivered"
) {
    if (processingStep) {
        processingStep.classList.add(
            "active-step"
        );
    }
}
if (
    status === "Shipped" ||
    status === "Delivered"
) {
    if (shippedStep) {
        shippedStep.classList.add(
            "active-step"
        );
    }
}
if (
    status === "Delivered"
) {
    if (deliveredStep) {
        deliveredStep.classList.add(
            "active-step"
        );
    }
}

// RENDER ITEMS
const orderItems =
    latestOrder.items || [];

orderItems.forEach((item) => {
    const div =
        document.createElement("div");
    div.classList.add(
        "order-item"
    );

    div.innerHTML = `
        <div class="order-item-left">
            <img
                src="${item.img || 'images/default-product.png'}"
                alt="${item.name || 'Product'}"
            >
            <div>
                <h4>
                    ${item.name || "Product"}
                </h4>
                <p>
                    Quantity: ${item.qty || 1}
                </p>
            </div>
        </div>
        <h4>
            ₹${parseFloat(
                item.price || 0
            ).toFixed(2)}
        </h4>
    `;

    if (orderItemsContainer) {
        orderItemsContainer.appendChild(
            div
        );
    }
});