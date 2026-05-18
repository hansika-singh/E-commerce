console.log("Shop page loaded successfully!");

// =============================
// ELEMENTS
// =============================

const searchInput =
    document.getElementById(
        "search-input"
    );

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );

const products =
    document.querySelectorAll(
        ".pro"
    );

const sortSelect =
    document.getElementById(
        "sort-select"
    );

const productContainer =
    document.querySelector(
        ".pro-container"
    );

// =============================
// SEARCH FILTER
// =============================

searchInput.addEventListener(
    "keyup",
    () => {

        const value =
            searchInput.value
            .toLowerCase();

        products.forEach((product) => {

            const productName =
                product.innerText
                .toLowerCase();

            if(
                productName.includes(value)
            ){

                product.classList.remove(
                    "hide-product"
                );

            }else{

                product.classList.add(
                    "hide-product"
                );

            }

        });

    }
);

// =============================
// CATEGORY FILTER
// =============================

filterButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach((btn) => {

                btn.classList.remove(
                    "active-filter"
                );

            });

            button.classList.add(
                "active-filter"
            );

            const category =
                button.dataset.category;

            products.forEach((product) => {

                if(
                    category === "all"
                ){

                    product.classList.remove(
                        "hide-product"
                    );

                }else if(
                    product.dataset.category
                    === category
                ){

                    product.classList.remove(
                        "hide-product"
                    );

                }else{

                    product.classList.add(
                        "hide-product"
                    );

                }

            });

        }
    );

});

// =============================
// SORT PRODUCTS
// =============================

sortSelect.addEventListener(
    "change",
    () => {

        const sortedProducts =
            Array.from(products);

        if(
            sortSelect.value
            === "low-high"
        ){

            sortedProducts.sort(
                (a, b) => {

                    return (
                        a.dataset.price -
                        b.dataset.price
                    );

                }
            );

        }

        if(
            sortSelect.value
            === "high-low"
        ){

            sortedProducts.sort(
                (a, b) => {

                    return (
                        b.dataset.price -
                        a.dataset.price
                    );

                }
            );

        }

        sortedProducts.forEach(
            (product) => {

                productContainer.appendChild(
                    product
                );

            }
        );

    }
);

// =============================
// PRODUCT REDIRECT
// =============================

products.forEach((product) => {

    product.addEventListener(
        "click",
        () => {

            window.location.href =
                "product.html";

        }
    );

});