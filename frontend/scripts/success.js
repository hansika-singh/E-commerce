console.log("Success page loaded successfully!");

// =============================
// LOAD ORDER DATA
// =============================

const orders =
    JSON.parse(
        localStorage.getItem("orders")
    ) || [];

if(orders.length > 0){

    const latestOrder =
        orders[orders.length - 1];

    document.getElementById(
        "order-id"
    ).innerText =
        latestOrder.id;

    document.getElementById(
        "order-date"
    ).innerText =
        latestOrder.date;

}

// =============================
// SUCCESS ANIMATION
// =============================

const successIcon =
    document.querySelector(
        ".success-icon"
    );

successIcon.animate(
    [
        {
            transform: "scale(0)"
        },
        {
            transform: "scale(1.1)"
        },
        {
            transform: "scale(1)"
        }
    ],
    {
        duration: 800,
        easing: "ease"
    }
);