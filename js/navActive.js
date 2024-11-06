// js/navActive.js

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop().split('?')[0];
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach((link) => {
        const linkPage = link.getAttribute('href').split('?')[0];

        // Exclude links without href or '#' links
        if (!linkPage || linkPage === '#') return;

        // Check if the link corresponds to the current page
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
});
