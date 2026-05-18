console.log("Blog page loaded successfully!");

const blogBoxes = document.querySelectorAll(".blog-box");

blogBoxes.forEach((box) => {

    box.addEventListener("mouseenter", () => {

        box.style.transform = "translateY(-5px)";
        box.style.transition = "0.3s ease";

    });

    box.addEventListener("mouseleave", () => {

        box.style.transform = "translateY(0)";

    });

});