/**
 * Calendrier de reservation — vue semaine
 */
(function () {
    'use strict';

    var config = window.BOOKING_CONFIG;
    var grid = document.getElementById('booking-grid');
    var weekTitle = document.getElementById('booking-week-title');
    var prevBtn = document.getElementById('booking-prev');
    var nextBtn = document.getElementById('booking-next');

    // Modal
    var modal = document.getElementById('booking-modal');
    var modalBackdrop = document.getElementById('booking-modal-backdrop');
    var modalIcon = document.getElementById('booking-modal-icon');
    var modalTitle = document.getElementById('booking-modal-title');
    var modalText = document.getElementById('booking-modal-text');
    var modalCancel = document.getElementById('booking-modal-cancel');
    var modalConfirm = document.getElementById('booking-modal-confirm');

    var DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    var HOURS_START = 9;
    var HOURS_END = 19;

    var currentWeekStart = getMonday(new Date());
    var slideDirection = null; // 'left' ou 'right'

    function getMonday(d) {
        var date = new Date(d);
        var day = date.getDay();
        var diff = day === 0 ? -6 : 1 - day;
        date.setDate(date.getDate() + diff);
        date.setHours(0, 0, 0, 0);
        return date;
    }

    function formatDate(date) {
        var y = date.getFullYear();
        var m = String(date.getMonth() + 1).padStart(2, '0');
        var d = String(date.getDate()).padStart(2, '0');
        return y + '-' + m + '-' + d;
    }

    function formatLocalDatetime(date) {
        return formatDate(date) + ' ' + String(date.getHours()).padStart(2, '0') + ':00';
    }

    function formatShortDate(date) {
        return String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0');
    }

    function formatReadable(datetimeStr) {
        var parts = datetimeStr.split(' ');
        var dateParts = parts[0].split('-');
        var day = parseInt(dateParts[2], 10);
        var monthIdx = parseInt(dateParts[1], 10) - 1;
        var months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
            'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        return day + ' ' + months[monthIdx] + ' à ' + parts[1];
    }

    // --- Modal ---
    function showModal(options) {
        modalIcon.className = 'booking-modal__icon ' + options.iconClass;
        modalIcon.innerHTML = options.iconSvg;
        modalTitle.textContent = options.title;
        modalText.textContent = options.text;

        modalConfirm.className = 'booking-modal__btn booking-modal__btn--confirm ' + options.confirmClass;
        modalConfirm.textContent = options.confirmLabel;

        modal.classList.add('booking-modal--open');

        var onConfirm = function () {
            cleanup();
            options.onConfirm();
        };
        var onCancel = function () {
            cleanup();
        };
        function cleanup() {
            modal.classList.remove('booking-modal--open');
            modalConfirm.removeEventListener('click', onConfirm);
            modalCancel.removeEventListener('click', onCancel);
            modalBackdrop.removeEventListener('click', onCancel);
        }

        modalConfirm.addEventListener('click', onConfirm);
        modalCancel.addEventListener('click', onCancel);
        modalBackdrop.addEventListener('click', onCancel);
    }

    // --- Semaine ---
    function updateWeekTitle() {
        var end = new Date(currentWeekStart);
        end.setDate(end.getDate() + 6);

        var months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
            'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

        weekTitle.textContent =
            currentWeekStart.getDate() + ' ' + months[currentWeekStart.getMonth()] +
            ' — ' + end.getDate() + ' ' + months[end.getMonth()] + ' ' + end.getFullYear();
    }

    function loadSlots() {
        var weekParam = formatDate(currentWeekStart);
        updateWeekTitle();

        fetch(config.slotsUrl + '?week=' + weekParam)
            .then(function (r) { return r.json(); })
            .then(function (data) { renderGrid(data.slots); })
            .catch(function () { grid.innerHTML = '<p style="padding:2rem;grid-column:1/-1;text-align:center;color:#991b1b;">Erreur de chargement.</p>'; });
    }

    function renderGrid(slots) {
        grid.innerHTML = '';

        // Animation slide
        grid.classList.remove('booking__grid--slide-left', 'booking__grid--slide-right');
        if (slideDirection) {
            // Force reflow pour relancer l'animation
            void grid.offsetWidth;
            grid.classList.add(slideDirection === 'left' ? 'booking__grid--slide-left' : 'booking__grid--slide-right');
            slideDirection = null;
        }

        var now = new Date();
        var slotIndex = 0;

        // Header row
        var corner = document.createElement('div');
        corner.className = 'booking__header booking__header--time';
        corner.textContent = 'Heure';
        grid.appendChild(corner);

        for (var d = 0; d < 7; d++) {
            var dayDate = new Date(currentWeekStart);
            dayDate.setDate(dayDate.getDate() + d);

            var header = document.createElement('div');
            header.className = 'booking__header';
            header.innerHTML = DAYS[d] + '<span class="booking__header-date">' + formatShortDate(dayDate) + '</span>';
            grid.appendChild(header);
        }

        // Rows
        for (var h = HOURS_START; h <= HOURS_END; h++) {
            var timeLabel = document.createElement('div');
            timeLabel.className = 'booking__time-label';
            timeLabel.textContent = String(h).padStart(2, '0') + ':00';
            grid.appendChild(timeLabel);

            for (var d2 = 0; d2 < 7; d2++) {
                var slotDate = new Date(currentWeekStart);
                slotDate.setDate(slotDate.getDate() + d2);
                slotDate.setHours(h, 0, 0, 0);

                var key = formatDate(slotDate) + ' ' + String(h).padStart(2, '0') + ':00';
                var slot = document.createElement('div');
                slot.className = 'booking__slot';

                var isPast = slotDate < now;
                var booking = slots[key] || null;

                if (isPast) {
                    slot.classList.add('booking__slot--past');
                    slot.textContent = booking ? 'Réservé' : '—';
                } else if (booking) {
                    if (config.isAuthenticated && booking.userId === config.userId) {
                        slot.classList.add('booking__slot--mine');
                        slot.textContent = 'Ma réservation';
                        slot.title = 'Cliquez pour annuler';
                        slot.setAttribute('data-id', booking.id);
                        slot.setAttribute('data-datetime-label', key);
                        slot.addEventListener('click', handleCancel);
                    } else {
                        slot.classList.add('booking__slot--booked');
                        slot.textContent = 'Réservé';
                    }
                } else if (config.isAuthenticated) {
                    slot.classList.add('booking__slot--available');
                    slot.textContent = 'Libre';
                    slot.setAttribute('data-datetime', formatLocalDatetime(slotDate));
                    slot.addEventListener('click', handleBook);
                } else {
                    slot.textContent = 'Libre';
                }

                // Stagger delay : cascade par colonne (jour) puis par ligne (heure)
                var delay = d2 * 0.03 + (h - HOURS_START) * 0.02;
                slot.style.animationDelay = delay.toFixed(2) + 's';
                slotIndex++;

                grid.appendChild(slot);
            }
        }
    }

    var calendarSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>';
    var cancelSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

    function handleBook(e) {
        var datetime = e.currentTarget.getAttribute('data-datetime');

        showModal({
            iconClass: 'booking-modal__icon--book',
            iconSvg: calendarSvg,
            title: 'Confirmer la réservation',
            text: 'Voulez-vous réserver le créneau du ' + formatReadable(datetime) + ' ?',
            confirmClass: 'booking-modal__btn--confirm-book',
            confirmLabel: 'Réserver',
            onConfirm: function () {
                fetch(config.bookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ datetime: datetime })
                })
                    .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
                    .then(function (res) {
                        if (res.ok) {
                            loadSlots();
                        } else {
                            showErrorModal(res.data.error || 'Erreur lors de la réservation.');
                        }
                    })
                    .catch(function () { showErrorModal('Erreur réseau.'); });
            }
        });
    }

    function handleCancel(e) {
        var id = e.currentTarget.getAttribute('data-id');
        var label = e.currentTarget.getAttribute('data-datetime-label');

        showModal({
            iconClass: 'booking-modal__icon--cancel',
            iconSvg: cancelSvg,
            title: 'Annuler la réservation',
            text: 'Voulez-vous annuler votre réservation du ' + formatReadable(label) + ' ?',
            confirmClass: 'booking-modal__btn--confirm-danger',
            confirmLabel: 'Annuler la réservation',
            onConfirm: function () {
                fetch(config.cancelUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: parseInt(id, 10) })
                })
                    .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
                    .then(function (res) {
                        if (res.ok) {
                            loadSlots();
                        } else {
                            showErrorModal(res.data.error || 'Erreur lors de l\'annulation.');
                        }
                    })
                    .catch(function () { showErrorModal('Erreur réseau.'); });
            }
        });
    }

    function showErrorModal(message) {
        showModal({
            iconClass: 'booking-modal__icon--cancel',
            iconSvg: cancelSvg,
            title: 'Erreur',
            text: message,
            confirmClass: 'booking-modal__btn--confirm-book',
            confirmLabel: 'OK',
            onConfirm: function () {}
        });
    }

    // Navigation avec animation slide
    prevBtn.addEventListener('click', function () {
        slideDirection = 'right';
        currentWeekStart.setDate(currentWeekStart.getDate() - 7);
        loadSlots();
    });

    nextBtn.addEventListener('click', function () {
        slideDirection = 'left';
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        loadSlots();
    });

    // Init
    loadSlots();
})();
