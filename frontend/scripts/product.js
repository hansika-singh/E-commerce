console.log("Product page loaded successfully!");

// =============================
// PRODUCT IMAGE GALLERY
// =============================

const mainImage =
    document.getElementById(
        "main-product-image"
    );

const smallImages =
    document.querySelectorAll(
        ".small-image"
    );

smallImages.forEach((image) => {

    image.addEventListener(
        "click",
        () => {

            mainImage.src = image.src;

        }
    );

});

// =============================
// QUANTITY CONTROLS
// =============================

const qtyInput =
    document.getElementById(
        "product-qty"
    );

document.getElementById(
    "plus-btn"
).addEventListener(
    "click",
    () => {

        qtyInput.value =
            parseInt(qtyInput.value) + 1;

    }
);

document.getElementById(
    "minus-btn"
).addEventListener(
    "click",
    () => {

        if(parseInt(qtyInput.value) > 1){

            qtyInput.value =
                parseInt(qtyInput.value) - 1;

        }

    }
);

// =============================
// ADD TO CART
// =============================

document.getElementById(
    "add-to-cart-btn"
).addEventListener(
    "click",
    () => {

        const cart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];

        const item = {

            name: "Men's Fashion T Shirt",

            price: "₹999",

            img: mainImage.src,

            qty: parseInt(qtyInput.value)

        };

        const existing =
            cart.find(
                (p) => p.name === item.name
            );

        if(existing){

            existing.qty += item.qty;

        }else{

            cart.push(item);

        }

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        alert(
            "Product added to cart!"
        );

    }
);

// =============================
// WISHLIST
// =============================

document.getElementById(
    "wishlist-btn"
).addEventListener(
    "click",
    () => {

        let wishlist =
            JSON.parse(
                localStorage.getItem(
                    "wishlist"
                )
            ) || [];

        const productName =
            "Men's Fashion T Shirt";

        if(!wishlist.includes(productName)){

            wishlist.push(productName);

            localStorage.setItem(
                "wishlist",
                JSON.stringify(wishlist)
            );

            alert(
                "Added to wishlist!"
            );

        }else{

            alert(
                "Already in wishlist!"
            );

        }

    }
);