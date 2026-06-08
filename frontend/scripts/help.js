// Help FAQ Accordion Script

document.addEventListener("DOMContentLoaded", () => {
    const faqBoxes = document.querySelectorAll(".faq-box");

    faqBoxes.forEach((box) => {
        const question = box.querySelector(".faq-question");
        if (!question) return;

        question.addEventListener("click", () => {

            // Close all other FAQs
            faqBoxes.forEach((item) => {
                if (item !== box) {
                    item.classList.remove("active");
                }
            });

            // Toggle current FAQ
            box.classList.toggle("active");
        });
    });
});