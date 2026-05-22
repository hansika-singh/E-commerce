console.log("Cart page loaded successfully!");
const API_BASE = "http://localhost:5000/api";

// API BASE URL & GLOBAL STATE
const notify = (message, type = "info") => {
    if (typeof showToast === "function") {
        showToast(message, type);
    } else {
        alert(message);
    }
};

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartContainer = document.getElementById("cart-items");
const subtotalElement = document.getElementById("subtotal");
const taxElement = document.getElementById("tax");
const totalElement = document.getElementById("total");

// RENDER CART (Backend Integration)
async function renderCart() {
    if (!cartContainer) return;
    cartContainer.innerHTML = "";

    if(cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add products to continue shopping.</p>
                <a href="shop.html" class="continue-shopping-btn">Continue Shopping</a>
            </div>
        `;
        subtotalElement.innerText = "₹0";
        taxElement.innerText = "₹0";
        totalElement.innerText = "₹0";
        return;
    }

    let subtotal = 0;

    cart.forEach((item, index) => {
        const price =
            parseFloat(item.price) || 0;
        subtotal += price * item.qty;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>Price: ₹${price}</p>
                <div class="cart-qty-controls">
                    <button data-index="${index}" class="decrease-qty">-</button>
                    <span>${item.qty}</span>
                    <button data-index="${index}" class="increase-qty">+</button>
                </div>
            </div>
            <button class="remove-btn" data-index="${index}">Remove</button>
        `;
        cartContainer.appendChild(cartItem);
    });

    const tax = subtotal * 0.18;
    const shippingCost = parseInt(localStorage.getItem("shippingCost") || 0);
    const total = subtotal + tax + shippingCost;

    if (subtotalElement) {
        subtotalElement.innerText =
            `₹${subtotal}`;
    }
    
    if (taxElement) {
        taxElement.innerText =
            `₹${tax.toFixed(2)}`;
    }
    
    const shippingElement =
        document.getElementById(
            "checkout-shipping"
        );
    
    if (shippingElement) {
        shippingElement.innerText =
            shippingCost === 0
                ? "Free"
                : `₹${shippingCost}`;
    }
    
    if (totalElement) {
        totalElement.innerText =
            `₹${total.toFixed(2)}`;
    }

    attachCartEventListeners();
}

// CART EVENT LISTENERS
function attachCartEventListeners() {
    document.querySelectorAll(".increase-qty").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            if (!cart[index]) return;
            cart[index].qty++;
            saveCart();
            renderCart();
        });
    });

    document.querySelectorAll(".decrease-qty").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            if (!cart[index]) return;
            if (cart[index].qty > 1) {
                cart[index].qty--;
            } else {
                cart.splice(index, 1);
            }
            saveCart();
            renderCart();
        });
    });

    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            if (!cart[index]) return;
            cart.splice(index, 1);
            saveCart();
            renderCart();
        });
    });
}

// ADD TO CART FROM PRODUCT CARD / PRODUCT PAGE
async function addToCartFromProduct(product) {
    const item = {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        img: product.img || product.image,
        color: product.color,
        size: product.size,
        qty: product.qty || 1
    };

    const existing = cart.find(p => p.id === item.id && p.color === item.color && p.size === item.size);
    if(existing) existing.qty += item.qty;
    else cart.push(item);

    saveCart();
    notify("Added to cart 🛍️", "success");

    // Optional: POST to backend for logged-in users
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
                await refreshTokenAndRetry(() => addToCartFromProduct(product));
            }
        } catch(err){
            console.error("Error adding item to backend cart:", err);
        }
    }

    // Update cart totals if cart page is open
    if(document.getElementById("cart-items")){
        renderCart();
    }
}

// SAVE CART
function saveCart(){
    localStorage.setItem("cart", JSON.stringify(cart));
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
    if (document.getElementById("cart-items")) {
        renderCart();
    }
});