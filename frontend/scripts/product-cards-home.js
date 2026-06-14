// featured products container
const homeFeaturedContainer =
    document.getElementById(
        "featured-products"
    );

// new arrivals container
const homeArrivalsContainer =
    document.getElementById(
        "new-arrivals-container"
    );

// safe helpers
function safeText(
    value,
    fallback = ""
) {
    return String(
        value ?? fallback
    );
}

function safePrice(
    value
) {
    const parsed =
        parseFloat(value);

    return isNaN(parsed)
        ? 0
        : parsed;
}

// render product card
function createProductCard(
    product
) {
    const rating =
        Math.min(
            5,
            Math.max(
                0,
                Number(
                    product.rating || 4
                )
            )
        );

    const stars =
        Array.from(
            {
                length: 5
            },
            (_, index) => {
                return `
                    <i class="fas fa-star${
                        index < rating
                            ? ""
                            : "-o"
                    }"></i>
                `;
            }
        ).join("");

    return `
        <div class="pro fade-in">
            ${
                product.featured
                    ? `
                        <span class="product-badge">
                            Featured
                        </span>
                    `
                    : ""
            }

            <img
                src="${
                    defaultImage(
                        product.image
                    )
                }"
                alt="${
                    safeText(
                        product.name,
                        "Product"
                    )
                }"
                loading="lazy"
            >

            <div class="des">
                <span>
                    ${
                        safeText(
                            product.category,
                            "Fashion"
                        )
                    }
                </span>

                <h5>
                    ${
                        safeText(
                            product.name,
                            "Product"
                        )
                    }
                </h5>

                <div class="star">
                    ${stars}
                </div>

                <h4>
                    ${
                        formatPrice(
                            safePrice(
                                product.price
                            )
                        )
                    }
                </h4>

                <div class="product-actions">
                    <button
                        type="button"
                        class="view-product-btn"
                        data-id="${
                            product.id
                        }"
                    >
                        View
                    </button>

                    <button
                        type="button"
                        class="add-cart-btn"
                        data-id="${
                            product.id
                        }"
                    >
                        Add Cart
                    </button>
                    
                    <button
                        type="button"
                        class="wishlist-btn"
                        data-id="${product.id}"
                        aria-label="Add to Wishlist"
                    >
                        <i class="${ AppUtils.getWishlist().some(item => String(item.id) === String(product.id)) ? 'fas' : 'far' } fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// render featured products
function renderFeaturedProducts(
    products = []
) {
    if (
        !homeFeaturedContainer
    ) {
        return;
    }

    const featured =
        products.filter(
            (product) =>
                product.featured
        );

    homeFeaturedContainer.innerHTML =
        featured.length
            ? featured
                .slice(0, 8)
                .map(
                    createProductCard
                )
                .join("")
            : `
                <p class="empty-products">
                    No featured products found
                </p>
            `;

    if (typeof initializeProductCardFeatures === "function") {
        initializeProductCardFeatures();
    }
}

// render new arrivals
function renderNewArrivals(
    products = []
) {
    if (
        !homeArrivalsContainer
    ) {
        return;
    }

    // Filter out featured products to match script.js logic
    const arrivals =
        products.filter(
            (product) =>
                Number(product.featured) !== 1
        ).slice(0, 8);

    homeArrivalsContainer.innerHTML =
        arrivals.length
            ? arrivals
                .map(
                    createProductCard
                )
                .join("")
            : `
                <p class="empty-products">
                    No new arrivals found
                </p>
            `;

    if (typeof initializeProductCardFeatures === "function") {
        initializeProductCardFeatures();
    }
}

// expose globally
window.renderFeaturedProducts =
    renderFeaturedProducts;

window.renderNewArrivals =
    renderNewArrivals;

window.createProductCard =
    createProductCard;