// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize Bootstrap tooltips
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach((tooltipTriggerEl) => {
            new bootstrap.Tooltip(tooltipTriggerEl);
        });

        // Set up event listeners for modals
        const modalButtons = document.querySelectorAll("[data-bs-toggle='modal']");
        modalButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const targetModalSelector = button.getAttribute('data-bs-target');
                const targetModal = document.querySelector(targetModalSelector);
                if (targetModal) {
                    const modal = new bootstrap.Modal(targetModal);
                    modal.show();
                } else {
                    console.warn(`Modal with selector ${targetModalSelector} not found.`);
                }
            });
        });

        // Any additional site-wide JavaScript logic can go here
    } catch (error) {
        console.error('Error initializing main.js:', error);
    }
});
