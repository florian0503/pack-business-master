document.addEventListener('DOMContentLoaded', function () {
    /* Timeline progress on scroll */
    var progress = document.getElementById('timeline-progress');
    var line = progress ? progress.parentElement : null;
    var items = document.querySelectorAll('.about-timeline__item');
    if (progress && line && items.length) {
        function updateProgress() {
            var lineRect = line.getBoundingClientRect();
            var lineHeight = line.offsetHeight;
            var viewportMiddle = window.innerHeight * 0.5;
            var scrolled = viewportMiddle - lineRect.top;
            var ratio = Math.max(0, Math.min(1, scrolled / lineHeight));
            progress.style.height = (ratio * 100) + '%';

            var progressY = lineRect.top + (ratio * lineHeight);

            items.forEach(function (item) {
                var card = item.querySelector('.about-timeline__card');
                var dot = item.querySelector('.about-timeline__dot');
                if (!card || !dot) return;
                var cardRect = card.getBoundingClientRect();
                var cardCenter = cardRect.top + cardRect.height / 2;
                if (progressY >= cardCenter) {
                    dot.classList.add('is-active');
                } else {
                    dot.classList.remove('is-active');
                }
            });
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    /* Animated counters */
    var counters = document.querySelectorAll('.about-stats__number[data-count]');
    if (counters.length) {
        var animated = false;

        function animateCounters() {
            if (animated) return;
            animated = true;

            counters.forEach(function (counter) {
                var target = parseInt(counter.getAttribute('data-count'), 10);
                var duration = 2000;
                var startTime = null;

                function step(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var elapsed = Math.min((timestamp - startTime) / duration, 1);
                    var eased = 1 - Math.pow(1 - elapsed, 3);
                    counter.textContent = Math.floor(eased * target);
                    if (elapsed < 1) {
                        requestAnimationFrame(step);
                    } else {
                        counter.textContent = target;
                    }
                }

                requestAnimationFrame(step);
            });
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });

        var section = document.getElementById('about-stats');
        if (section) {
            observer.observe(section);
        }
    }
});
