console.log("Admin panel loaded successfully!");

// =============================
// DEMO ADMIN CHECK
// =============================

firebase.auth().onAuthStateChanged((user) => {

    if(!user){

        window.location.href = "signin.html";

    }

});

// =============================
// STORAGE
// =============================

let products =
    JSON.parse(
        localStorage.getItem(
            "adminProducts"
        )
    ) || [];

let orders =
    JSON.parse(
        localStorage.getItem(
            "orders"
        )
    ) || [];

// =============================
// ELEMENTS
// =============================

const productForm =
    document.getElementById(
        "product-form"
    );

const productTableBody =
    document.getElementById(
        "product-table-body"
    );

const ordersTableBody =
    document.getElementById(
        "orders-table-body"
    );

// =============================
// RENDER STATS
// =============================

function renderStats(){

    document.getElementById(
        "total-orders"
    ).innerText =
        orders.length;

    document.getElementById(
        "total-products"
    ).innerText =
        products.length;

    document.getElementById(
        "total-users"
    ).innerText =
        localStorage.getItem(
            "visits"
        ) || 0;

    let revenue = 0;

    orders.forEach((order) => {

        order.items.forEach((item) => {

            const price =
                parseInt(
                    item.price.replace(
                        /\D/g,
                        ""
                    )
                );

            revenue +=
                price * item.qty;

        });

    });

    document.getElementById(
        "total-revenue"
    ).innerText =
        `₹${revenue}`;

}

// =============================
// ADD PRODUCT
// =============================

productForm.addEventListener(
    "submit",
    (e) => {

        e.preventDefault();

        const product = {

            id: Date.now(),

            name:
                document.getElementById(
                    "product-name"
                ).value,

            price:
                document.getElementById(
                    "product-price"
                ).value,

            description:
                document.getElementById(
                    "product-description"
                ).value,

            image:
                document.getElementById(
                    "product-image"
                ).value

        };

        products.push(product);

        localStorage.setItem(
            "adminProducts",
            JSON.stringify(products)
        );

        productForm.reset();

        renderProducts();

        renderStats();

        alert(
            "Product added successfully!"
        );

    }
);

// =============================
// RENDER PRODUCTS
// =============================

function renderProducts(){

    productTableBody.innerHTML = "";

    products.forEach((product) => {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>
                ${product.name}
            </td>

            <td>
                ₹${product.price}
            </td>

            <td>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteProduct(${product.id})"
                >

                    Delete

                </button>

            </td>
        `;

        productTableBody.appendChild(
            row
        );

    });

}

// =============================
// DELETE PRODUCT
// =============================

function deleteProduct(id){

    products =
        products.filter(
            (product) =>
                product.id !== id
        );

    localStorage.setItem(
        "adminProducts",
        JSON.stringify(products)
    );

    renderProducts();

    renderStats();

}

// =============================
// RENDER ORDERS
// =============================

function renderOrders(){

    ordersTableBody.innerHTML = "";

    orders.forEach((order) => {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>
                ${order.id}
            </td>

            <td>
                ${order.date}
            </td>

            <td>
                ${order.items.length}
            </td>
        `;

        ordersTableBody.appendChild(
            row
        );

    });

}

// =============================
// INITIALIZE
// =============================

renderProducts();

renderOrders();

renderStats();