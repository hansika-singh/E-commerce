console.log("About page loaded successfully!");

const aboutSections = document.querySelectorAll("#about-head, #about-app");

aboutSections.forEach((section) => {

    section.addEventListener("mouseenter", () => {

        section.style.transform = "translateY(-5px)";
        section.style.transition = "0.3s ease";

    });

    section.addEventListener("mouseleave", () => {

        section.style.transform = "translateY(0)";

    });

});