async function loadComponent(id, file) {
    const element =
        document.getElementById(id);
    if (!element) return;
    element.innerHTML =
        "<p>Loading...</p>";
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(
                `Failed to load ${file}`
            );
        }
        const data = await response.text();
        element.innerHTML = data;
    } catch (error) {
        console.error(
            `Error loading component: ${file}`,
            error
        );
        element.innerHTML =
            "<p>Failed to load component.</p>";
    }
}

document.addEventListener(
    "DOMContentLoaded",
    () => {
        loadComponent(
            "navbar",
            "components/navbar.html"
        );
        loadComponent(
            "footer",
            "components/footer.html"
        );
    }
);