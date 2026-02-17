document.addEventListener('DOMContentLoaded', function () {
    var regions = document.querySelectorAll('.team-map__region');
    var cards = document.querySelectorAll('.team-map__card');
    var title = document.getElementById('map-results-title');
    var resetBtn = document.getElementById('map-reset');
    var emptyMsg = document.getElementById('map-empty');
    var selectedLabel = document.getElementById('map-selected-label');
    var activeRegion = null;

    function showAll() {
        activeRegion = null;
        regions.forEach(function (r) { r.classList.remove('is-active'); });
        cards.forEach(function (c) { c.style.display = ''; });
        title.textContent = 'Toute l\'équipe';
        selectedLabel.textContent = 'Toute la France';
        resetBtn.style.display = 'none';
        emptyMsg.style.display = 'none';
    }

    function filterByRegion(regionId, label) {
        activeRegion = regionId;
        regions.forEach(function (r) {
            r.classList.toggle('is-active', r.dataset.region === regionId);
        });
        var count = 0;
        cards.forEach(function (c) {
            var match = c.dataset.region === regionId;
            c.style.display = match ? '' : 'none';
            if (match) count++;
        });
        title.textContent = label;
        selectedLabel.textContent = label;
        resetBtn.style.display = '';
        emptyMsg.style.display = count === 0 ? '' : 'none';
    }

    regions.forEach(function (region) {
        region.addEventListener('click', function () {
            if (activeRegion === region.dataset.region) {
                showAll();
            } else {
                filterByRegion(region.dataset.region, region.dataset.label);
            }
        });
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', showAll);
    }
});
