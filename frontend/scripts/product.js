console.log("Product page loaded successfully!");

// API BASE URL & GLOBAL STATE
const API_BASE = "http://localhost:5000/api";
const notify = (message, type = "info") => {
    if (typeof showToast === "function") {
        notify(message, type);
    } else {
        alert(message);
    }
};

let product = null;
try {
    product = JSON.parse(
        localStorage.getItem(
            "selectedProduct"
        )
    );
} catch (error) {
    console.error(
        "Invalid selectedProduct:",
        error
    );
}

const fallbackProduct = {
    id: 1,
    brand: "AnthropicBots",
    name: "Modern Fashion T-Shirt",
    category: "T-Shirt",
    price: 999,
    image: "../assets/images/f1.jpg",
    description: "Premium quality cotton t-shirt with breathable fabric and modern fashion styling.",
    stock: 12,
    rating: 4.5
};

const currentProduct = product || fallbackProduct;

// RECENTLY VIEWED PRODUCTS
let viewedProducts = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
viewedProducts = viewedProducts.filter(item => item.id !== currentProduct.id);
viewedProducts.unshift({
    id: currentProduct.id,
    name: currentProduct.name,
    brand: currentProduct.brand,
    category: currentProduct.category,
    price: currentProduct.price,
    image: currentProduct.image
});

viewedProducts = viewedProducts.slice(0, 8);
localStorage.setItem("recentlyViewed", JSON.stringify(viewedProducts));

// ELEMENTS
const mainImage =
    document.getElementById(
        "main-product-image"
    );

const smallImages =
    document.querySelectorAll(
        ".small-image"
    );

const qtyInput =
    document.getElementById(
        "product-qty"
    );

if (qtyInput) {
    qtyInput.addEventListener(
        "input",
        () => {
            if(
                qtyInput.value < 1
                ||
                isNaN(qtyInput.value)
            ){
                qtyInput.value = 1;
            }
        }
    );
}

// RENDER PRODUCT
const productCategory =
    document.getElementById(
        "product-category"
    );

const productName =
    document.getElementById(
        "product-name"
    );

const productPrice =
    document.getElementById(
        "product-price"
    );

const productBrand =
    document.getElementById(
        "product-brand"
    );

const productDescription =
    document.getElementById(
        "product-description"
    );

const productStock =
    document.getElementById(
        "product-stock"
    );

const productRatingText =
    document.getElementById(
        "product-rating-text"
    );

if (productCategory) {
    productCategory.innerText =
        `Home / ${
            currentProduct.category ||
            "Category"
        }`;
}

if (productName) {
    productName.innerText =
        currentProduct.name ||
        "Product";
}

if (productPrice) {
    productPrice.innerText =
        `₹${parseFloat(
            currentProduct.price || 0
        ).toFixed(2)}`;
}

if (productBrand) {
    productBrand.innerText =
        currentProduct.brand ||
        "Brand";
}

if (productDescription) {
    productDescription.innerText =
        currentProduct.description ||
        "Premium quality product.";
}

if (productStock) {
    productStock.innerText =
        currentProduct.stock > 0
            ? `${currentProduct.stock} Available`
            : "Out Of Stock";
}

if (productRatingText) {
    productRatingText.innerText =
        `(${
            currentProduct.rating || 4.5
        } Ratings)`;
}

const ratingContainer =
    document.querySelector(
        ".product-rating"
    );

const rating =
    Math.round(
        currentProduct.rating || 4.5
    );

let starsHTML = "";

for(
    let i = 0;
    i < 5;
    i++
){
    if(i < rating){
        starsHTML += `
            <i class="fas fa-star"></i>
        `;
    }else{
        starsHTML += `
            <i class="far fa-star"></i>
        `;
    }
}

if (ratingContainer) {
    ratingContainer.innerHTML = `
        ${starsHTML}
        <span id="product-rating-text">
            (${currentProduct.rating || 4.5} Ratings)
        </span>
    `;
}

const deliveryDate =
    new Date();

deliveryDate.setDate(
    deliveryDate.getDate() + 4
);

const formattedDelivery =
    deliveryDate.toDateString();

const deliveryElement =
    document.createElement("p");

deliveryElement.classList.add(
    "delivery-date"
);

deliveryElement.innerHTML = `
    <i class="fas fa-truck"></i>
    Delivery by:
    ${formattedDelivery}
`;

const productTopMeta =
    document.querySelector(
        ".product-top-meta"
    );
if (productTopMeta) {
    productTopMeta.appendChild(
        deliveryElement
    );
}

// PRODUCT VARIANTS
const productVariants = {
    Black: {
        M: 12,
        L: 8,
        XL: 5,
        XXL: 2,
        image:
            currentProduct.image
    },

    Blue: {
        M: 9,
        L: 6,
        XL: 4,
        XXL: 1,
        image:
            "../assets/images/f2.jpg"
    },

    Red: {
        M: 7,
        L: 5,
        XL: 3,
        XXL: 1,
        image:
            "../assets/images/f3.jpg"
    },

    White: {
        M: 10,
        L: 7,
        XL: 4,
        XXL: 2,
        image:
            "../assets/images/f4.jpg"
    }
};

let selectedColor =
    "Black";

let selectedSize =
    "M";

// ELEMENTS
const colorButtons =
    document.querySelectorAll(
        ".color-btn"
    );

const sizeButtons =
    document.querySelectorAll(
        ".size-btn"
    );

const variantStock =
    document.getElementById(
        "variant-stock"
    );

// UPDATE VARIANT
function updateVariant(){
    const stock =
        productVariants[
            selectedColor
        ][selectedSize];

    if (variantStock) {
        variantStock.innerText =
            stock;
    }

    if(stock <= 3){
        if (variantStock) {
            variantStock.style.color =
            "red";
        }
    }else{
        if (variantStock) {
            variantStock.style.color =
            "#088178";
        }
    }

    if (mainImage) {
        mainImage.src =
            productVariants[
                selectedColor
            ].image;
    }
}

// COLOR EVENTS
colorButtons.forEach((button) => {
    button.addEventListener(
        "click",
        () => {
            colorButtons.forEach(
                (btn) => {
                    btn.classList.remove(
                        "active-color"
                    );
                }
            );
            button.classList.add(
                "active-color"
            );
            selectedColor =
                button.dataset.color;
            updateVariant();
        }
    );
});

// SIZE EVENTS
sizeButtons.forEach((button) => {
    button.addEventListener(
        "click",
        () => {
            sizeButtons.forEach(
                (btn) => {
                    btn.classList.remove(
                        "active-size"
                    );
                }
            );
            button.classList.add(
                "active-size"
            );
            selectedSize =
                button.dataset.size;
            updateVariant();
        }
    );
});

// INITIALIZE VARIANT
updateVariant();

// PRODUCT IMAGES
mainImage.src =
    currentProduct.image;
const galleryImages = [
    currentProduct.image,
    "../assets/images/f2.jpg",
    "../assets/images/f3.jpg",
    "../assets/images/f4.jpg"
];

smallImages.forEach((image, index) => {
    image.src =
        galleryImages[index];
    image.addEventListener(
        "click",
        () => {
            mainImage.src =
                galleryImages[index];
        }
    );
});

// QUANTITY CONTROLS
document.getElementById(
    "plus-btn"
).addEventListener(
    "click",
    () => {
        const currentVariantStock =
            productVariants[
                selectedColor
            ][selectedSize];

        if(
            parseInt(qtyInput.value)
            < currentVariantStock
        ){
            qtyInput.value =
                parseInt(qtyInput.value) + 1;
        }
    }
);

document.getElementById(
    "minus-btn"
).addEventListener(
    "click",
    () => {
        if(
            parseInt(qtyInput.value) > 1
        ){
            qtyInput.value =
                parseInt(qtyInput.value) - 1;
        }
    }
);

// ADD TO CART
document.getElementById("add-to-cart-btn").addEventListener("click", async () => {
    const currentVariantStock = productVariants[selectedColor][selectedSize];
    const qty = parseInt(qtyInput.value);

    if(currentVariantStock <= 0 || qty > currentVariantStock){
        notify("Selected variant is out of stock or quantity exceeds stock!", "error");
        return;
    }

    const item = {
        id: currentProduct.id,
        name: currentProduct.name,
        price: parseFloat(currentProduct.price),
        img: mainImage.src,
        color: selectedColor,
        size: selectedSize,
        qty: qty
    };

    if(typeof addToCartFromProduct === "function"){
        await addToCartFromProduct(item);
    } else {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find(p => p.id === item.id && p.color === item.color && p.size === item.size);
        if(existing) existing.qty += item.qty;
        else cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));
        notify("Product added to cart 🛍️");
    }
});

// BUY NOW
document.getElementById("buy-now-btn").addEventListener("click", () => {
    const currentVariantStock = productVariants[selectedColor][selectedSize];
    const qty = parseInt(qtyInput.value);

    if(currentVariantStock <= 0 || qty > currentVariantStock){
        notify("Selected variant is out of stock or quantity exceeds stock!", "error");
        return;
    }

    const cart = [{
        id: currentProduct.id,
        name: currentProduct.name,
        price: parseFloat(currentProduct.price),
        img: mainImage.src,
        color: selectedColor,
        size: selectedSize,
        qty: qty
    }];

    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "checkout.html";
});

// WISHLIST
const wishlistBtn = document.getElementById("wishlist-btn");

function updateWishlistButton(){
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = wishlist.find(item => item.id === currentProduct.id);
    if (!wishlistBtn) return;
    wishlistBtn.innerHTML = exists
        ? `<i class="fas fa-heart"></i> Added To Wishlist`
        : `<i class="far fa-heart"></i> Wishlist`;
}

if (wishlistBtn) {
    wishlistBtn.addEventListener("click", () => {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        const exists = wishlist.find(item => item.id === currentProduct.id);

        if(!exists){
            wishlist.push({
                id: currentProduct.id,
                name: currentProduct.name,
                brand: currentProduct.brand,
                category: currentProduct.category,
                price: currentProduct.price,
                image: currentProduct.image
            });
            notify("Added to wishlist ❤️");
        } else {
            wishlist = wishlist.filter(item => item.id !== currentProduct.id);
            notify("Removed from wishlist ❌");
        }

        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        updateWishlistButton();
    });
}

updateWishlistButton();

// RELATED PRODUCTS
const relatedContainer = document.getElementById("related-products-container");
const adminProducts = JSON.parse(localStorage.getItem("adminProducts")) || [];
const relatedProducts = adminProducts.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id).slice(0, 4);
if(relatedProducts.length === 0){

    if (relatedContainer) {
        relatedContainer.innerHTML = `
            <p class="no-products">
                No related products available right now.
            </p>
        `;
    }
}
relatedProducts.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("pro");
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="des">
            <span>${product.brand || "Brand"}</span>
            <h5>${product.name}</h5>
            <div class="star">
                <i class="fas fa-star"></i><i class="fas fa-star"></i>
                <i class="fas fa-star"></i><i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
            </div>
            <h4>₹${product.price}</h4>
        </div>
    `;
    card.addEventListener("click", () => {
        localStorage.setItem("selectedProduct", JSON.stringify(product));
        window.location.href = "product.html";
    });
    relatedContainer.appendChild(card);
});

// PRODUCT REVIEWS SYSTEM
const reviewForm =
    document.getElementById(
        "review-form"
    );

const reviewContainer =
    document.getElementById(
        "review-container"
    );

// REVIEW STORAGE KEY
const reviewKey =
    `reviews-${currentProduct.id}`;

// LOAD REVIEWS
let reviews =
    JSON.parse(
        localStorage.getItem(
            reviewKey
        )
    ) || [];

// RENDER REVIEWS
function renderReviews(){
    if (!reviewContainer) return;
    reviewContainer.innerHTML = "";
    if(reviews.length === 0){
        reviewContainer.innerHTML = `
            <p>
                No reviews yet.
            </p>
        `;
        return;
    }

    reviews.forEach((review) => {
        const reviewBox =
            document.createElement("div");
        reviewBox.classList.add(
            "review-box"
        );

        let stars = "";

        for(
            let i = 0;
            i < review.rating;
            i++
        ){
            stars += `
                <i class="fas fa-star"></i>
            `;
        }

        reviewBox.innerHTML = `
            <h4>
                ${review.name}
            </h4>
            <div class="review-stars">
                ${stars}
            </div>
            <p>
                ${review.comment}
            </p>
            <div class="review-date">
                ${review.date}
            </div>
        `;

        reviewContainer.appendChild(
            reviewBox
        );
    });
}

// SUBMIT REVIEW
if(reviewForm){
    reviewForm.addEventListener(
        "submit",
        (e) => {        
            e.preventDefault();
            const name =
                document.getElementById(
                    "review-name"
                ).value;

            const rating =
                parseInt(
                    document.getElementById(
                        "review-rating"
                    ).value
                );
            
            const comment =
                document.getElementById(
                    "review-comment"
                ).value;
            
            const review = {            
                name,
                rating,
                comment,
                date:
                    new Date()
                    .toLocaleDateString()
            };

            reviews.unshift(review);        
            localStorage.setItem(
                reviewKey,
                JSON.stringify(reviews)
            );

            renderReviews();
            reviewForm.reset();
            const total =
                reviews.reduce(
                    (sum, item) =>
                        sum + item.rating,
                    0
                );
            
            const average =
                (
                    total /
                    reviews.length
                ).toFixed(1);
            
            const updatedRatingContainer =
                document.querySelector(
                    ".product-rating"
                );
            
            let updatedStars = "";
            
            for(
                let i = 0;
                i < 5;
                i++
            ){
                if(
                    i < Math.round(average)
                ){  
                    updatedStars += `
                        <i class="fas fa-star"></i>
                    `;
                }else{
                    updatedStars += `
                        <i class="far fa-star"></i>
                    `;
                }            
            }
            updatedRatingContainer.innerHTML = `
                ${updatedStars}
                <span id="product-rating-text">
                    (${average} Ratings)
                </span>
            `;
            notify(
                "Review submitted! 📝"
            );
        }
    );
}

// INITIALIZE REVIEWS
renderReviews();

// RECOMMENDED PRODUCTS ENGINE
const recommendedContainer =
    document.getElementById(
        "recommended-products-container"
    );

const wishlist =
    JSON.parse(
        localStorage.getItem(
            "wishlist"
        )
    ) || [];

const wishlistExists =
    wishlist.find(
        (item) =>
            item.id ===
            currentProduct.id
    );

if(wishlistExists){
    document.getElementById(
        "wishlist-btn"
    ).innerHTML = `
        <i class="fas fa-heart"></i>
        Added To Wishlist
    `;
}

const recentlyViewed =
    JSON.parse(
        localStorage.getItem(
            "recentlyViewed"
        )
    ) || [];

let recommendedProducts =
    adminProducts.filter((item) => {

        // Exclude current product
        if(
            item.id ===
            currentProduct.id
        ){
            return false;
        }

        // Match category
        if(
            item.category ===
            currentProduct.category
        ){
            return true;
        }

        // Match wishlist category
        const wishlistMatch =
            wishlist.find(
                (wish) =>
                    wish.category ===
                    item.category
            );

        if(wishlistMatch){
            return true;
        }

        // Match recently viewed category
        const viewedMatch =
            recentlyViewed.find(
                (viewed) =>
                    viewed.category ===
                    item.category
            );
        if(viewedMatch){
            return true;
        }
        return false;
    });

// Limit recommendations
recommendedProducts =
    recommendedProducts.slice(0, 4);

if(recommendedProducts.length === 0){

    recommendedProducts =
        adminProducts
        .filter(
            (item) =>
                item.id !==
                currentProduct.id
        )
        .slice(0, 4);
}

// RENDER RECOMMENDATIONS
if(recommendedProducts.length === 0){
    recommendedContainer.innerHTML = `
        <p class="no-products">
            No recommendations available right now.
        </p>
    `;
}

recommendedProducts.forEach((product) => {
    const card =
        document.createElement("div");
    card.classList.add("pro");
    card.innerHTML = `
        <img
            src="${product.image}"
            alt="${product.name}"
        >
        <div class="des">
            <span>
                ${product.brand || "Brand"}
            </span>
            <h5>
                ${product.name}
            </h5>
            <div class="star">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
            </div>
            <h4>
                ₹${product.price}
            </h4>
        </div>
    `;

    card.addEventListener(
        "click",
        () => {
            localStorage.setItem(
                "selectedProduct",
                JSON.stringify(product)
            );
            window.location.href =
                "product.html";
        }
    );

    recommendedContainer.appendChild(
        card
    );
}); 