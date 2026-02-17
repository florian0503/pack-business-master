(function () {
    /* Scroll to top */
    var btn = document.getElementById('scroll-top');
    if (btn) {
        var darkSections = document.querySelectorAll('[data-scroll-top-light]');
        window.addEventListener('scroll', function () {
            btn.classList.toggle('is-visible', window.scrollY > 300);
            if (darkSections.length) {
                var btnRect = btn.getBoundingClientRect();
                var onDark = false;
                for (var i = 0; i < darkSections.length; i++) {
                    var rect = darkSections[i].getBoundingClientRect();
                    if (btnRect.bottom > rect.top && btnRect.top < rect.bottom) {
                        onDark = true;
                        break;
                    }
                }
                btn.classList.toggle('scroll-top--light', onDark);
            }
        }, { passive: true });
        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* Reveal on scroll */
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(function (el) { observer.observe(el); });
    }

    /* Subtle parallax on hero video */
    var heroVideo = document.querySelector('.hero__video');
    if (heroVideo) {
        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                heroVideo.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
            }
        }, { passive: true });
    }

    /* Stagger children on scroll */
    var staggers = document.querySelectorAll('[data-stagger]');
    if (staggers.length) {
        var staggerObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var children = entry.target.children;
                    for (var i = 0; i < children.length; i++) {
                        children[i].classList.add('is-visible');
                    }
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
        staggers.forEach(function (el) { staggerObserver.observe(el); });
    }

    /* Section toggles (mobile) */
    var toggles = [
        { btn: 'services-toggle', grid: '.services__grid', open: 'Voir plus', close: 'Voir moins' },
        { btn: 'gallery-toggle', grid: '.gallery__grid', open: 'Voir plus', close: 'Voir moins' },
        { btn: 'blog-toggle', grid: '.blog__grid', open: 'Voir plus', close: 'Voir moins' },
        { btn: 'team-toggle', grid: '.team__grid', open: 'Voir toute notre \u00e9quipe', close: 'Voir moins' },
        { btn: 'svc-cards-toggle', grid: '.svc-cards__grid', open: 'Voir plus', close: 'Voir moins' }
    ];
    toggles.forEach(function (t) {
        var btn = document.getElementById(t.btn);
        var grid = document.querySelector(t.grid);
        if (btn && grid) {
            btn.addEventListener('click', function () {
                var expanded = grid.classList.toggle('is-expanded');
                btn.innerHTML = expanded
                    ? t.close + ' <span>&uarr;</span>'
                    : t.open + ' <span>&darr;</span>';
            });
        }
    });
})();
