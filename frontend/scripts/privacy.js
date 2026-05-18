console.log("Privacy Policy page loaded successfully!");

const policySections = document.querySelectorAll(
    "#privacy-policy h3"
);

policySections.forEach((section) => {

    section.addEventListener("mouseenter", () => {

        section.style.color = "#088178";
        section.style.transition = "0.3s ease";

    });

    section.addEventListener("mouseleave", () => {

        section.style.color = "#222";

    });

});