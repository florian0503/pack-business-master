document.addEventListener('DOMContentLoaded', function () {
    if (typeof gsap === 'undefined' || window.innerWidth < 769) return;

    gsap.registerPlugin(ScrollTrigger);

    var items = document.querySelectorAll('.svc-reveal');
    var pin = document.querySelector('.svc-process__pin');
    if (!items.length || !pin) return;

    var headerH = document.getElementById('site-header') ? document.getElementById('site-header').offsetHeight : 0;

    var tl = gsap.timeline({
        scrollTrigger: {
            trigger: '#svc-process',
            pin: pin,
            pinSpacing: true,
            start: 'top ' + headerH,
            end: '+=' + (items.length * 300),
            scrub: 0.8,
            anticipatePin: 1
        }
    });

    items.forEach(function (item, i) {
        tl.fromTo(item,
            { opacity: 0, scale: 0.85, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power2.out' }
        );
        if (i < items.length - 1) {
            tl.to({}, { duration: 0.3 });
        }
    });
});
