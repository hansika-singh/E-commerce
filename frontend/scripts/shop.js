// PRODUCTS STATE
(function(){
    let allProducts = [];
let filteredProducts = [];
// PAGINATION STATE
let currentPage = 1;
let totalPages = 1;
let currentSearch = "";
let currentCategory = "all";
let currentSort = "";
let currentProducts = [];

// SHOP PAGE ELEMENTS
const elements = {
    searchInput:
        document.getElementById(
            "search-input"
        ),

    filterButtons:
        document.querySelectorAll(
            ".filter-btn"
        ),

    sortSelect:
        document.getElementById(
            "sort-select"
        ),

    productContainer:
        document.getElementById(
            "product-container"
        )
};

// FETCH PRODUCTS
async function fetchProducts(
    page = 1
) {

    try {

        currentPage =
            page;

        if (
            elements.productContainer
        ) {

            elements.productContainer.innerHTML =
                `
                    <div class="loading-products">
                        Loading products...
                    </div>
                `;
        }

        // query params
        const params =
            new URLSearchParams({

                page:
                    currentPage,

                limit: 8
            });

        // search
        if (
            currentSearch
        ) {

            params.append(
                "search",
                currentSearch
            );
        }

        // category
        if (
            currentCategory !== "all"
        ) {

            params.append(
                "category",
                currentCategory
            );
        }

        // fetch from backend
        const data =
            await AppUtils.apiRequest(
                `/products?${params.toString()}`
            );

        if (
            !data.success
        ) {

            renderEmptyState(
                data.message ||
                "Failed to load products."
            );

            return;
        }

        currentProducts =
            Array.isArray(
                data.products
            )
                ? data.products
                : [];

        totalPages =
            Number(
                data.totalPages || 1
            );

        // sorting
        applySorting();

        // pagination ui
        renderPagination();

    } catch (error) {

        console.error(
            "SHOP FETCH ERROR:",
            error
        );

        renderEmptyState(
            "Failed to load products."
        );
    }
}

// EMPTY STATE
function renderEmptyState(
    message
) {
    if (
        !elements.productContainer
    ) {
        return;
    }
    elements.productContainer.innerHTML =
        `
            <div class="empty-products">
                <h3>${message}</h3>
            </div>
        `;
}

// STAR RATINGS
function renderStars(
    rating = 5
) {
    const safeRating =
        Math.min(
            Math.max(
                Number(rating) || 5,
                1
            ),
            5
        );

    return Array.from(
        {
            length: safeRating
        },
        () =>
            `
                <i class="fas fa-star"></i>
            `
    ).join("");
}

// PRODUCT CARD
function createProductCard(
    product
) {
    const displayName =
        product.name ||
        "Product";

    const stock =
        Number(product.stock) || 0;

    return `
        <div
            class="pro"
            data-product-id="${product.id}"
        >
            <img
                src="${AppUtils.defaultImage(product.image)}"
                alt="${displayName}"
                loading="lazy"
            >

            <div class="des">
                <span>
                    ${product.category || "Brand"}
                </span>
                <h5>
                    ${displayName}
                </h5>
                <div class="star">
                    ${renderStars(
                        product.rating
                    )}
                </div>
                <h4>
                    ${AppUtils.formatPrice(
                        product.price
                    )}
                </h4>
                <p class="stock-info">
                    ${
                        stock > 0
                            ? `Stock: ${stock}`
                            : "Out Of Stock"
                    }
                </p>
            </div>

            ${
                stock <= 0
                    ? `
                        <button
                            class="out-stock-btn"
                            disabled
                        >
                            Out Of Stock
                        </button>
                    `
                    : `
                        <div style="position: absolute; bottom: 20px; right: 12px; display: flex; gap: 8px; z-index: 2;">
                            <button class="wishlist-btn-shop cart" data-id="${product.id}" aria-label="Add to Wishlist" style="position: relative; bottom: 0; right: 0;">
                                <i class="${ AppUtils.getWishlist().some(item => String(item.id) === String(product.id)) ? 'fas' : 'far' } fa-heart"></i>
                            </button>
                            <button class="add-to-cart-icon cart" aria-label="Add to cart" style="position: relative; bottom: 0; right: 0;">
                                <i class="fal fa-shopping-cart"></i>
                            </button>
                        </div>
                    `
            }
        </div>
    `;
}

// RENDER PRODUCTS
function renderProducts(
    products = []
) {
    if (
        !elements.productContainer
    ) {
        return;
    }

    if (
        !Array.isArray(products)
        ||
        products.length === 0
    ) {
        renderEmptyState(
            "No products found."
        );
        return;
    }

    elements.productContainer.innerHTML =
        "";

    const fragment =
        document.createDocumentFragment();

    products.forEach(
        (product) => {
            const wrapper =
                document.createElement(
                    "div"
                );

            wrapper.innerHTML =
                createProductCard(
                    product
                );

            const card =
                wrapper.firstElementChild;

            if (card) {
                setupProductCard(
                    card,
                    product
                );

                fragment.appendChild(
                    card
                );
            }
        }
    );
    elements.productContainer.appendChild(
        fragment
    );
}

// PRODUCT CARD EVENTS
function setupProductCard(
    card,
    product
) {
    // navigate to product page
    card.addEventListener(
        "click",
        (event) => {
            if (
                event.target.closest(
                    ".add-to-cart-icon"
                )
            ) {
                return;
            }
            window.location.href =
                `product.html?id=${product.id}`;
        }
    );

    // add to cart
    const cartBtn =
        card.querySelector(
            ".add-to-cart-icon"
        );

    if (!cartBtn) {
        return;
    }
    cartBtn.addEventListener(
        "click",
        async (event) => {
            event.preventDefault();
            event.stopPropagation();
            const item = {
                id: product.id,
                name:
                    product.name ||
                    "Product",
                price:
                    parseFloat(
                        product.price
                    ) || 0,
                img:
                    AppUtils.defaultImage(
                        product.image
                    ),
                qty: 1
            };

            try {
                // centralized handler
                if (
                    typeof addToCartFromProduct ===
                    "function"
                ) {
                    await addToCartFromProduct(
                        item
                    );
                    return;
                }

                // fallback cart
                let cart =
                    AppUtils.getCart();

                const existingIndex =
                    cart.findIndex(
                        (p) =>
                            p.id ===
                            item.id
                    );

                if (
                    existingIndex >= 0
                ) {
                    cart[
                        existingIndex
                    ].qty += 1;
                } else {
                    cart.push(
                        item
                    );
                }

                AppUtils.saveCart(
                    cart
                );

                AppUtils.notify(
                    "Added to cart 🛍️",
                    "success"
                );

            } catch (error) {
                console.error(
                    "CART ERROR:",
                    error
                );

                AppUtils.notify(
                    "Failed to add product.",
                    "error"
                );
            }
        }
    );

    // add to wishlist
    const wishlistBtn = card.querySelector(".wishlist-btn-shop");
    if (wishlistBtn) {
        wishlistBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            // Re-use logic from product-actions-home.js if it's available, otherwise fallback
            if (typeof window.toggleWishlist === "function") {
                await window.toggleWishlist(product);
            } else {
                let wishlist = AppUtils.getWishlist();
                const exists = wishlist.some(item => String(item.id) === String(product.id));
                const token = AppUtils.getToken();

                if (exists) {
                    wishlist = wishlist.filter(item => String(item.id) !== String(product.id));
                    AppUtils.notify("Removed from wishlist", "info");
                    if (token) {
                        try {
                            await AppUtils.apiRequest("/wishlist/remove", {
                                method: "POST",
                                body: JSON.stringify({ productId: product.id })
                            });
                        } catch (e) {}
                    }
                } else {
                    wishlist.push(product);
                    AppUtils.notify("Added to wishlist ❤️", "success");
                    if (token) {
                        try {
                            await AppUtils.apiRequest("/wishlist/add", {
                                method: "POST",
                                body: JSON.stringify({ productId: product.id })
                            });
                        } catch (e) {}
                    }
                }
                AppUtils.saveWishlist(wishlist);
                
                // Update DOM icons dynamically
                const buttons = document.querySelectorAll(`.wishlist-btn[data-id="${product.id}"], .wishlist-btn-shop[data-id="${product.id}"]`);
                buttons.forEach(btn => {
                    const icon = btn.querySelector("i");
                    if (icon) {
                        if (exists) {
                            icon.classList.remove("fas");
                            icon.classList.add("far");
                        } else {
                            icon.classList.remove("far");
                            icon.classList.add("fas");
                        }
                    }
                });
            }
        });
    }
}

// SEARCH FILTER
function setupSearch() {

    if (
        !elements.searchInput
    ) {
        return;
    }

    let searchTimeout;

    elements.searchInput.addEventListener(
        "input",
        () => {

            clearTimeout(
                searchTimeout
            );

            searchTimeout =
                setTimeout(
                    () => {

                        currentSearch =
                            elements.searchInput.value
                                .trim();

                        fetchProducts(1);

                    },
                    400
                );
        }
    );
}

// CATEGORY FILTER
function setupCategoryFilters() {

    elements.filterButtons.forEach(
        (
            button
        ) => {

            button.addEventListener(
                "click",
                () => {

                    elements.filterButtons.forEach(
                        (
                            btn
                        ) => {

                            btn.classList.remove(
                                "active-filter"
                            );
                        }
                    );

                    button.classList.add(
                        "active-filter"
                    );

                    currentCategory =
                        button.dataset.category
                        || "all";

                    fetchProducts(1);
                }
            );
        }
    );
}

// SORTING
function applySorting() {

    let sortedProducts =
        [...currentProducts];

    if (
        !elements.sortSelect
    ) {

        renderProducts(
            sortedProducts
        );

        return;
    }

    const sortValue =
        elements.sortSelect.value;

    if (
        sortValue === "low-high"
    ) {

        sortedProducts.sort(
            (
                a,
                b
            ) => {

                return (
                    Number(a.price || 0)
                    -
                    Number(b.price || 0)
                );
            }
        );
    }

    if (
        sortValue === "high-low"
    ) {

        sortedProducts.sort(
            (
                a,
                b
            ) => {

                return (
                    Number(b.price || 0)
                    -
                    Number(a.price || 0)
                );
            }
        );
    }

    renderProducts(
        sortedProducts
    );
}

// SORT SELECT
function setupSorting() {
    if (
        !elements.sortSelect
    ) {
        return;
    }
    elements.sortSelect.addEventListener(
        "change",
        applySorting
    );
}

// PAGINATION UI
function renderPagination() {

    let pagination =
        document.getElementById(
            "pagination"
        );

    // auto create pagination
    if (
        !pagination
    ) {

        pagination =
            document.createElement(
                "div"
            );

        pagination.id =
            "pagination";

        pagination.className =
            "pagination";

        elements.productContainer?.after(
            pagination
        );
    }

    pagination.innerHTML =
        "";

    // previous
    const prevBtn =
        document.createElement(
            "button"
        );

    prevBtn.innerText =
        "← Prev";

    prevBtn.className = 
        "pagination-btn";

    prevBtn.disabled =
        currentPage <= 1;

    prevBtn.onclick =
        () => {

            if (
                currentPage > 1
            ) {

                fetchProducts(
                    currentPage - 1
                );
            }
        };

    pagination.appendChild(
        prevBtn
    );

    // page info
    const pageInfo =
        document.createElement(
            "span"
        );

    pageInfo.className = 
        "pagination-info";

    pageInfo.innerText =
        `Page ${currentPage} of ${totalPages}`;

    pagination.appendChild(
        pageInfo
    );

    // next
    const nextBtn =
        document.createElement(
            "button"
        );

    nextBtn.innerText =
        "Next →";

    nextBtn.className = 
        "pagination-btn";

    nextBtn.disabled =
        currentPage >= totalPages;

    nextBtn.onclick =
        () => {

            if (
                currentPage < totalPages
            ) {

                fetchProducts(
                    currentPage + 1
                );
            }
        };

    pagination.appendChild(
        nextBtn
    );
}

// INITIALIZATION
document.addEventListener(
    "DOMContentLoaded",
    () => {
        fetchProducts();
        setupSearch();
        setupCategoryFilters();
        setupSorting();
    }
);
})()