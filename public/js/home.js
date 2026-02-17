document.addEventListener('DOMContentLoaded', function () {
    /* GSAP Testimonials horizontal scroll */
    if (typeof gsap !== 'undefined' && window.innerWidth >= 769) {
        gsap.registerPlugin(ScrollTrigger);

        var track = document.getElementById('testimonials-track');
        var pin = document.querySelector('.testimonials__pin');
        if (track && pin) {
            var headerH = document.getElementById('site-header') ? document.getElementById('site-header').offsetHeight : 0;
            var scrollDistance = track.scrollWidth - window.innerWidth;

            gsap.to(track, {
                x: -scrollDistance,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#testimonials',
                    pin: pin,
                    pinSpacing: true,
                    start: 'top ' + headerH,
                    end: '+=' + (scrollDistance + 200),
                    scrub: 1,
                    anticipatePin: 1
                }
            });
        }
    }

    /* Team strip hover */
    var band = document.getElementById('team-strip-band');
    var nameEl = document.getElementById('team-strip-name');
    var roleEl = document.getElementById('team-strip-role');
    var innerEl = document.getElementById('team-strip-inner');
    var infoEl = document.getElementById('team-strip-info');
    if (band && nameEl && roleEl && innerEl && infoEl) {
        var items = band.querySelectorAll('.team-strip__item');
        var activeItem = null;
        var rafId = null;

        function trackPosition() {
            if (!activeItem) return;
            var bandRect = band.getBoundingClientRect();
            var itemRect = activeItem.getBoundingClientRect();
            var centerX = itemRect.left + itemRect.width / 2 - bandRect.left;
            innerEl.style.left = centerX + 'px';
            innerEl.style.transform = 'translateX(-50%)';
            rafId = requestAnimationFrame(trackPosition);
        }

        items.forEach(function (item) {
            item.addEventListener('mouseenter', function () {
                band.classList.add('is-hovered');
                item.classList.add('is-active');
                activeItem = item;
                nameEl.textContent = item.dataset.name;
                roleEl.textContent = item.dataset.role;
                innerEl.classList.add('is-visible');
                if (rafId) cancelAnimationFrame(rafId);
                trackPosition();
            });

            item.addEventListener('mouseleave', function () {
                band.classList.remove('is-hovered');
                item.classList.remove('is-active');
                activeItem = null;
                innerEl.classList.remove('is-visible');
                if (rafId) cancelAnimationFrame(rafId);
            });
        });
    }
});
