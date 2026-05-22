console.log("Shop page loaded successfully!");
const API_BASE = "http://localhost:5000/api";

// API BASE URL
const notify = (message, type = "info") => {
    if (typeof showToast === "function") {
        showToast(message, type);
    } else {
        alert(message);
    }
};

// PRODUCTS ARRAY
let allProducts = [];

// ELEMENTS
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");
const sortSelect = document.getElementById("sort-select");
const productContainer = document.getElementById("product-container");

// FETCH PRODUCTS FROM BACKEND
async function fetchProducts() {
    try {
        const res = await fetch(`${API_BASE}/products`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await res.json();
        if(data.success) {
            allProducts = data.products;
            renderProducts(allProducts);
        } else {
            if (productContainer) {
                productContainer.innerHTML =
                    `<h3>${data.message}</h3>`;
            }
        }
    } catch(error) {
        console.error(error);
        if (productContainer) {
            productContainer.innerHTML =
                `<h3>Failed to load products.</h3>`;
        }
    }
}

// RENDER PRODUCTS
function renderProducts(products) {
    const productContainer = document.getElementById("product-container");

    if (!productContainer) {
        return;
    }

    productContainer.innerHTML = "";

    if(products.length === 0){
        productContainer.innerHTML = `<h3>No products found.</h3>`;
        return;
    }

    products.forEach((product, idx) => {
        const productCard = document.createElement("div");
        productCard.classList.add("pro");

        const displayName = product.name || "Product";

        productCard.innerHTML = `
            <img src="${product.image || `../assets/images/f${(idx%4)+1}.jpg`}" alt="${displayName}">
            <div class="des">
                <span>${product.category || 'Brand'}</span>
                <h5>${displayName}</h5>
                <div class="star">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i>
                    <i class="fas fa-star"></i><i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
                <h4>₹${product.price}</h4>
                <p class="stock-info">${product.stock > 0 ? `Stock: ${product.stock}` : 'Out Of Stock'}</p>
            </div>
            ${product.stock === 0
                ? `<button class="out-stock-btn">Out Of Stock</button>`
                : `<button class="add-to-cart-icon"><i class="fal fa-shopping-cart cart"></i></button>`}
        `;

        // Navigate to product page
        productCard.addEventListener("click", () => {
            localStorage.setItem("selectedProduct", JSON.stringify(product));
            window.location.href = "product.html";
        });

        // Add to cart click handler
        const cartBtn = productCard.querySelector(".add-to-cart-icon");
        if(cartBtn){
            cartBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const item = {
                    id: product.id,
                    name: displayName,
                    price: parseFloat(product.price) || 0,
                    img: product.image || `../assets/images/f${(idx%4)+1}.jpg`,
                    qty: 1
                };

                // Call centralized cart function if exists
                if(typeof addToCartFromProduct === "function"){
                    await addToCartFromProduct(item);
                } else {
                    let cart = JSON.parse(localStorage.getItem("cart")) || [];
                    const existing = cart.find(p => p.id === item.id);
                    if(existing) existing.qty++;
                    else cart.push(item);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    notify(
                        "Added to cart 🛍️",
                        "success"
                    );
                }
            });
        }
        productContainer.appendChild(productCard);
    });
}

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    // SEARCH FILTER
    if (searchInput) {
        searchInput.addEventListener("keyup", () => {
            const value =
                searchInput.value.toLowerCase();
            const filtered =
                allProducts.filter((product) =>
                    (product.name || "")
                        .toLowerCase()
                        .includes(value)
                );
            renderProducts(filtered);
        });
    }

    // CATEGORY FILTER
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterButtons.forEach((btn) =>
                btn.classList.remove(
                    "active-filter"
                )
            );

            button.classList.add(
                "active-filter"
            );

            const category =
                button.dataset.category;

            if(category === "all"){
                renderProducts(allProducts);
                return;
            }

            const filtered =
                allProducts.filter(
                    (product) =>
                        (product.category || "")
                            .toLowerCase() === category
                );

            renderProducts(filtered);
        });
    });

    // SORT PRODUCTS
    if (sortSelect) {
        sortSelect.addEventListener(
            "change",
            () => {
                let sortedProducts =
                    [...allProducts];

                if (
                    sortSelect.value ===
                    "low-high"
                ) {
                    sortedProducts.sort(
                        (a, b) =>
                            a.price - b.price
                    );
                }

                if (
                    sortSelect.value ===
                    "high-low"
                ) {
                    sortedProducts.sort(
                        (a, b) =>
                            b.price - a.price
                    );
                }

                renderProducts(
                    sortedProducts
                );
            }
        );
    }
});