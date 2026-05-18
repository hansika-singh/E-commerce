console.log("Contact page loaded successfully!");

const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if(!name || !email || !subject || !message){
        alert("Please fill all fields.");
        return;
    }

    if(!email.match(/^[^ ]+@[^ ]+\.[a-z]{2,3}$/)){
        alert("Please enter a valid email.");
        return;
    }
    alert("Message submitted successfully!");
    contactForm.reset();
});