// frontend/scripts/ordersHistory.js
console.log("Orders history page loaded successfully!");

import { getJSON, $ } from "./utils.js";

// LOAD ALL ORDERS
const orders = getJSON("orders") || [];

// ELEMENTS
const ordersContainer = $("#orders-history-container");
const ordersCount = $("#orders-history-count");

// DISPLAY ORDERS COUNT
if (ordersCount) {
    ordersCount.innerText = orders.length;
}

// DISPLAY ORDERS LIST
if (ordersContainer) {
    ordersContainer.innerHTML = "";

    if (orders.length === 0) {
        ordersContainer.innerHTML =
            "<p>No past orders found.</p>";
    } else {
        orders.forEach((order) => {
            const div = document.createElement("div");
            div.classList.add("order-history-item");
            div.innerHTML = `
                <h4>Order ID: ${order.id || "N/A"}</h4>
                <p>Date: ${order.date || "N/A"}</p>
                <p>Status: ${order.status || "Pending"}</p>
                <div class="order-items-list">
                    ${(order.items || [])
                        .map(
                            (item) => `
                        <div class="order-item">
                            <img src="${item.img || "images/default-product.png"}" alt="${item.name || "Product"}">
                            <div>
                                <h5>${item.name || "Product"}</h5>
                                <p>Qty: ${item.qty || 1}</p>
                                <p>₹${parseFloat(item.price || 0).toFixed(2)}</p>
                            </div>
                        </div>
                    `
                        )
                        .join("")}
                </div>
            `;
            ordersContainer.appendChild(div);
        });
    }
}