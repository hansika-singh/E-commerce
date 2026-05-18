async function loadComponent(id, file) {

    const element = document.getElementById(id);

    if (!element) return;

    try {

        const response = await fetch(file);

        const data = await response.text();

        element.innerHTML = data;

    } catch (error) {

        console.error(`Error loading component: ${file}`, error);
    }
}

loadComponent("navbar", "components/navbar.html");
loadComponent("footer", "components/footer.html");