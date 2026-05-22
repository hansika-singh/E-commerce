console.log("Wishlist page loaded successfully!");

// API BASE URL & GLOBAL STATE
const API_BASE = "http://localhost:5000/api";
const notify = (message, type = "info") => {
    if (typeof showToast === "function") {
        showToast(message, type);
    } else {
        alert(message);
    }
};

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ELEMENTS
const wishlistContainer = document.getElementById("wishlist-container");
const emptyWishlist = document.getElementById("empty-wishlist");

// RENDER WISHLIST
function renderWishlist() {
    if (!wishlistContainer) return;
    wishlistContainer.innerHTML = "";

    if (wishlist.length === 0) {
        if (emptyWishlist) {
            emptyWishlist.style.display =
                "block";
        }
        return;
    }

    if (emptyWishlist) {
        emptyWishlist.style.display =
            "none";
    }

    wishlist.forEach((product, index) => {
        const card = document.createElement("div");
        card.classList.add("wishlist-card");
        card.innerHTML = `
            <img
                src="${product.image || 'images/default-product.png'}"
                alt="${product.name || 'Product'}"
            >
            <div class="wishlist-content">
                <span>${product.brand || "Brand"}</span>
                <h4>
                    ${product.name || "Product"}
                </h4>
                <p class="wishlist-price">
                    ₹${parseFloat(
                        product.price || 0
                    ).toFixed(2)}
                </p>
                <div class="wishlist-buttons">
                    <button class="add-cart-btn" data-index="${index}">
                        <i class="fas fa-shopping-cart"></i> Add To Cart
                    </button>
                    <button class="remove-btn" data-index="${index}">
                        <i class="fas fa-trash-alt"></i> Remove
                    </button>
                </div>
            </div>
        `;

        // Navigate to product page
        const productInfo = card.querySelector("img, h4");
        productInfo.addEventListener("click", () => {
            localStorage.setItem("selectedProduct", JSON.stringify(product));
            window.location.href = "product.html";
        });
        wishlistContainer.appendChild(card);
    });
    attachWishlistEventListeners();
}

// WISHLIST EVENT LISTENERS
function attachWishlistEventListeners() {
    document.querySelectorAll(".add-cart-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const button =
                e.target.closest("button");

            if (!button) return;

            const index =
                parseInt(
                    button.dataset.index
                );
            await addToCartFromWishlist(index);
        });
    });

    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const button =
                e.target.closest("button");

            if (!button) return;

            const index =
                parseInt(
                    button.dataset.index
                );
            await removeWishlist(index);
        });
    });
}

// REMOVE WISHLIST ITEM
async function removeWishlist(index) {
    if (!wishlist[index]) return;
    const product =
        wishlist[index];
    wishlist.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    renderWishlist();

    const token = localStorage.getItem("token");
    if(token){
        try{
            const res = await fetch(`${API_BASE}/wishlist/remove`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ productId: product.id })
            });
            const data = await res.json();
            if(data.message === "Token expired"){
                await refreshTokenAndRetry(() => removeWishlist(index));
            }
            else if(!data.success) console.warn("Backend wishlist remove failed:", data.message);
        } catch(err){
            console.error("Error removing wishlist item:", err);
        }
    }
}

// ADD TO CART FROM WISHLIST
async function addToCartFromWishlist(index) {
    if (!wishlist[index]) return;
    const product =
        wishlist[index];

    const item = {
        id: product.id,
        name: product.name,
        price:
            parseFloat(product.price) || 0,
        img: product.image,
        qty: 1
    };

    const existing = cart.find(p => p.id === item.id);
    if(existing) existing.qty++;
    else cart.push(item);

    localStorage.setItem("cart", JSON.stringify(cart));
    notify(
        "Added to cart 🛍️",
        "success"
    );

    // POST to backend if logged in
    const token = localStorage.getItem("token");
    if(token){
        try{
            const res = await fetch(`${API_BASE}/cart/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(item)
            });
            const data = await res.json();
            if(data.message === "Token expired"){
                await refreshTokenAndRetry(() => addToCartFromWishlist(index));
            }
            else if(!data.success) console.warn("Backend cart add failed:", data.message);
        } catch(err){
            console.error("Error adding item to cart:", err);
        }
    }
}

// REFRESH TOKEN HELPER
async function refreshTokenAndRetry(callback){
    const refreshToken = localStorage.getItem("refreshToken");
    if(!refreshToken) return;

    try {
        const res = await fetch(`${API_BASE}/auth/refresh-token`, {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({refreshToken})
        });
        const data = await res.json();
        if(data.accessToken){
            localStorage.setItem("token", data.accessToken);
            await callback(); // retry original request
        }
    } catch(err){
        console.error("Error refreshing token:", err);
    }
}

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    renderWishlist();
});