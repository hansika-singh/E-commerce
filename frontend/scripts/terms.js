console.log("Terms & Conditions page loaded successfully!");

const termSections = document.querySelectorAll(
    "#terms-content h3"
);

termSections.forEach((section) => {

    section.addEventListener("mouseenter", () => {

        section.style.color = "#088178";
        section.style.transition = "0.3s ease";

    });

    section.addEventListener("mouseleave", () => {

        section.style.color = "#222";

    });

});