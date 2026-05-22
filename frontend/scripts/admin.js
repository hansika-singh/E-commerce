console.log("Admin panel loaded successfully!");
const API_BASE = "http://localhost:5000/api";
const user = JSON.parse(
    localStorage.getItem("user") || "null"
);
const token = localStorage.getItem("token");

if (
    !token ||
    !user ||
    user.role !== "admin"
) {
    window.location.href = "signin.html";
}

const notify = (
    message,
    type = "info"
) => {
    if (
        typeof showToast === "function"
    ) {
        showToast(message, type);
    } else {
        alert(message);
    }
};

// BACKEND API CONFIG
// Helper function for backend requests with JWT
const apiRequest = async (url, method = "GET", body = null) => {
    const token = localStorage.getItem("token");
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    };
    if (body) options.body = JSON.stringify(body);
    const res = await fetch(
        `${API_BASE}${url}`,
        options
    );
    return await res.json();
};

// ELEMENTS
const productForm = document.getElementById("product-form");
const productTableBody = document.getElementById("product-table-body");
const ordersTableBody = document.getElementById("orders-table-body");

// FETCH INITIAL DATA
let products = [];
let orders = [];

const loadInitialData = async () => {
    try {
        const productsRes = await apiRequest("/api/products");
        if (productsRes.success) products = productsRes.products;

        const ordersRes = await apiRequest("/api/orders");
        if (ordersRes.success) orders = ordersRes.orders;

        renderProducts();
        renderOrders();
        renderStats();
    } catch (error) {
        console.error("Failed to load initial data", error);
    }
};

// RENDER STATS
function renderStats() {
    const totalOrders =
        document.getElementById(
            "total-orders"
        );

    const totalProducts =
        document.getElementById(
            "total-products"
        );

    const totalUsers =
        document.getElementById(
            "total-users"
        );

    const totalRevenue =
        document.getElementById(
            "total-revenue"
        );

    if (totalOrders) {
        totalOrders.innerText =
            orders.length;
    }

    if (totalProducts) {
        totalProducts.innerText =
            products.length;
    }

    if (totalUsers) {
        totalUsers.innerText =
            localStorage.getItem(
                "visits"
            ) || 0;
    }

    const revenue = orders.reduce(
        (sum, order) => {
            return (
                sum +
                parseFloat(
                    order.total || 0
                )
            );
        },
        0
    );

    if (totalRevenue) {
        totalRevenue.innerText =
            `₹${revenue.toFixed(2)}`;
    }
}

// ADD PRODUCT
if (productForm) {
    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const productData = {
            name: document.getElementById("product-name").value,
            category: document.getElementById("product-category").value,
            price: parseFloat(
                document.getElementById(
                    "product-price"
                ).value
            ) || 0,
            description: document.getElementById("product-description").value,
            image: document.getElementById("product-image").value,
            stock: parseInt(
                document.getElementById(
                    "product-stock"
                ).value
            ) || 0,
            featured: document.getElementById("featured-product").checked,
        };

        try {
            const res = await apiRequest("/api/products", "POST", productData);
            if (res.success) {
                notify(
                    "Product added successfully!",
                    "success"
                );
                await loadInitialData();
                productForm.reset();
            } else {
                notify(
                    res.message ||
                    "Failed to add product",
                    "error"
                );
            }
        } catch (error) {
            console.error(error);
            notify(
                "Failed to add product.",
                "error"
            );
        }
    });
}

// RENDER PRODUCTS
function renderProducts() {
    if (!productTableBody) return;
    productTableBody.innerHTML = "";

    products.forEach((product) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₹${product.price}</td>
            <td>${product.stock}</td>
            <td>${product.featured ? "Featured" : "—"}</td>
            <td>
                <button class="action-btn" onclick="editProduct(${product.id})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });
}

// DELETE PRODUCT
async function deleteProduct(id) {
    try {
        const res = await apiRequest(`/api/products/${id}`, "DELETE");
        if (res.success) {
            products = products.filter(
                (p) => p.id !== id
            );
            renderProducts();
            renderStats();
            notify(
                "Product deleted successfully!",
                "success"
            );
        } else {
            notify(
                res.message ||
                "Failed to delete product",
                "error"
            );
        }
    } catch (error) {
        console.error(error);
        notify(
            "Failed to delete product.",
            "error"
        );
    }
}

// EDIT PRODUCT
async function editProduct(id) {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const newName = prompt("Edit Product Name", product.name);
    const newPrice = prompt("Edit Product Price", product.price);
    const newStock = prompt("Edit Product Stock", product.stock);

    if (
        newName &&
        !isNaN(newPrice) &&
        !isNaN(newStock)
    ) {
        const updatedData = {
            name: newName,
            description:
                product.description || "",
            price: parseFloat(newPrice),
            image:
                product.image || "",
            category:
                product.category || "",
            stock: parseInt(newStock),
            featured:
                product.featured || false
        };

        try {
            const res = await apiRequest(`/api/products/${id}`, "PUT", updatedData);
            if (res.success) {
                Object.assign(product, updatedData);
                renderProducts();
                renderStats();
                notify(
                    "Product updated successfully!",
                    "success"
                );
            } else {
                notify(
                    res.message ||
                    "Failed to update product",
                    "error"
                );
            }
        } catch (error) {
            console.error(error);
            notify(
                "Failed to update product.",
                "error"
            );
        }
    }
}

// RENDER ORDERS
function renderOrders() {
    if (!ordersTableBody) return;
    ordersTableBody.innerHTML = "";
    orders.forEach((order) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.date}</td>
            <td>₹${parseFloat(
                order.total || 0
            ).toFixed(2)}</td>
        `;
        ordersTableBody.appendChild(row);
    });
}

// INITIALIZE
loadInitialData();