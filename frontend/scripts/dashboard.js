console.log("Dashboard loaded successfully!");

const token = localStorage.getItem("token");
const user = JSON.parse(
    localStorage.getItem("user")
);

if (!token || !user) {
    window.location.href = "signin.html";
} else {
    loadUserData(user);
}

function loadUserData(user){
    const userName = document.getElementById("user-name");
    const userEmail = document.getElementById("user-email");
    const settingsName = document.getElementById(
        "settings-name"
    );

    const settingsEmail = document.getElementById(
        "settings-email"
    );

    if (userName) {
    userName.innerText = user.name || "User";
    }
    
    if (userEmail) {
        userEmail.innerText = user.email || "";
    }
    
    if (settingsName) {
        settingsName.value = user.name || "";
    }
    
    if (settingsEmail) {
        settingsEmail.value = user.email || "";
    }
}

const menuItems = document.querySelectorAll(
    ".dashboard-menu li"
);

const tabs = document.querySelectorAll(
    ".dashboard-tab"
);

menuItems.forEach((item) => {
    item.addEventListener("click", () => {
        menuItems.forEach((menu) => {
            menu.classList.remove("active-tab");
        });

        tabs.forEach((tab) => {
            tab.classList.remove("active");
        });

        item.classList.add("active-tab");

        const target = item.dataset.tab;

        const targetElement =
            document.getElementById(
                target
            );
        
        if (targetElement) {
            targetElement.classList.add(
                "active"
            );
        }
    });
});


const wishlist = JSON.parse(
    localStorage.getItem("wishlist")
) || [];

const wishlistContainer = document.getElementById(
    "wishlist-items"
);

const wishlistCount =
    document.getElementById(
        "wishlist-count"
    );

if (wishlistCount) {
    wishlistCount.innerText =
        wishlist.length;
}

if(wishlist.length === 0){
    if (wishlistContainer) {
        wishlistContainer.innerHTML =
            "<p>No wishlist items found.</p>";
    }
}else{
    wishlist.forEach((item) => {
        const p = document.createElement("p");
        p.innerText = item;
        if (wishlistContainer) {
            wishlistContainer.appendChild(p);
        }
    });
}

const cart = JSON.parse(
    localStorage.getItem("cart")
) || [];

const cartContainer = document.getElementById(
    "saved-cart-items"
);

const cartCount =
    document.getElementById(
        "cart-count-dashboard"
    );

if (cartCount) {
    cartCount.innerText =
        cart.length;
}

if(cart.length === 0){
    if (cartContainer) {
        cartContainer.innerHTML =
            "<p>No saved cart items found.</p>";
    }
}else{
    cart.forEach((item) => {
        const p = document.createElement("p");
        p.innerText = `${item.name} (${item.qty})`;
        if (cartContainer) {
            cartContainer.appendChild(p);
        }
    });
}

const orders = JSON.parse(
    localStorage.getItem("orders")
) || [];

const ordersContainer = document.getElementById(
    "orders-list"
);

const ordersCount =
    document.getElementById(
        "orders-count"
    );

if (ordersCount) {
    ordersCount.innerText =
        orders.length;
}

if(orders.length === 0){
    if (ordersContainer) {
        ordersContainer.innerHTML =
            "<p>No orders found.</p>";
    }
}else{
    orders.forEach((order) => {
        const p = document.createElement("p");

        p.innerText =
            `${order.id} • ${order.date}`;

        if (ordersContainer) {
            ordersContainer.appendChild(p);
        }
    });
}

const settingsForm = document.getElementById(
    "settings-form"
);

if (settingsForm) {
    settingsForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (typeof notify === "function") {
            notify(
                "Profile updated successfully!",
                "success"
            );
        } else {
            alert(
                "Profile updated successfully!"
            );
        }
    });
}

// HASH TAB NAVIGATION
function openTabFromHash(){
    const hash =
        window.location.hash.replace("#", "");

    if(!hash) return;

    const menuItems =
        document.querySelectorAll(
            ".dashboard-menu li"
        );

    const tabs =
        document.querySelectorAll(
            ".dashboard-tab"
        );
        
    menuItems.forEach((menu) => {
        menu.classList.remove("active-tab");
    });

    tabs.forEach((tab) => {
        tab.classList.remove("active");
    });

    const targetTab =
        document.getElementById(hash);

    const targetMenu =
        document.querySelector(
            `.dashboard-menu li[data-tab="${hash}"]`
        );

    if(targetTab){
        targetTab.classList.add("active");
    }

    if(targetMenu){
        targetMenu.classList.add(
            "active-tab"
        );
    }
}

window.addEventListener(
    "load",
    openTabFromHash
);