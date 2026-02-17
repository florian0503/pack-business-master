document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.navbar__toggle');
    var menu = document.getElementById('navbar-menu');

    var header = document.getElementById('site-header');

    if (toggle && menu && header) {
        toggle.addEventListener('click', function () {
            var isOpen = menu.classList.toggle('is-open');
            toggle.classList.toggle('is-active', isOpen);
            header.classList.toggle('menu-open', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    if (header && header.dataset.transparent === '1') {
        var onScroll = function () {
            header.classList.toggle('is-scrolled', window.scrollY > 80);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }
});
