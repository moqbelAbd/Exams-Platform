export function showToast(message, type = "info", duration = 3000) {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fa-solid ${iconFor(type)}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    // trigger enter animation
    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.add("hide");
        toast.addEventListener("transitionend", () => toast.remove(), { once: true });
    }, duration);
}

function iconFor(type) {
    switch (type) {
        case "success": return "fa-circle-check";
        case "error": return "fa-circle-xmark";
        default: return "fa-circle-info";
    }
}