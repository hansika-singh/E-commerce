// frontend/scripts/recentlyViewed.js
console.log("Recently viewed products loaded!");

import { getJSON, $ } from "./utils.js";

// LOAD RECENTLY VIEWED PRODUCTS
const recentlyViewed = getJSON("recentlyViewed") || [];

// ELEMENTS
const recentContainer = $("#recently-viewed-container");
const recentCount = $("#recently-viewed-count");

// DISPLAY COUNT
if (recentCount) {
    recentCount.innerText = recentlyViewed.length;
}

// DISPLAY PRODUCTS
if (recentContainer) {
    recentContainer.innerHTML = "";

    if (recentlyViewed.length === 0) {
        recentContainer.innerHTML =
            "<p>No recently viewed products.</p>";
    } else {
        recentlyViewed.forEach((product) => {
            const div = document.createElement("div");
            div.classList.add("recent-product-item");
            div.innerHTML = `
                <img src="${product.image || "images/default-product.png"}" alt="${product.name || "Product"}">
                <h4>${product.name || "Product"}</h4>
                <p>₹${parseFloat(product.price || 0).toFixed(2)}</p>
            `;
            recentContainer.appendChild(div);
        });
    }
}