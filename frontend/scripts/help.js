console.log("Help Center page loaded successfully!");

const faqBoxes = document.querySelectorAll(".faq-box");

faqBoxes.forEach((box) => {

    const question = box.querySelector(".faq-question");

    question.addEventListener("click", () => {

        faqBoxes.forEach((item) => {

            if(item !== box){

                item.classList.remove("active");

            }

        });

        box.classList.toggle("active");

    });

});