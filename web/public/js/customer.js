/* BarberBook PH customer area: progressive enhancement only. Every page works without this file. */
(function () {
  'use strict';

  // Guard stepper buttons (hidden until JS is available).
  document.querySelectorAll('[data-stepper]').forEach(function (wrap) {
    var input = wrap.querySelector('input');
    wrap.querySelectorAll('button[data-step]').forEach(function (b) {
      b.hidden = false;
      b.addEventListener('click', function () {
        var v = parseInt(input.value || '0', 10) + parseInt(b.dataset.step, 10);
        input.value = Math.max(0, Math.min(8, isNaN(v) ? 0 : v));
      });
    });
  });

  // Notes counter.
  var notes = document.getElementById('notes'), count = document.getElementById('notesCount');
  if (notes && count) notes.addEventListener('input', function () { count.textContent = notes.value.length; });

  // Refresh the slot grid without reloading when a calendar day is tapped.
  var card = document.getElementById('slotsCard'), cal = document.getElementById('calForm');
  if (!card || !cal || !window.fetch) return;
  var box = document.getElementById('slotsBox'), title = document.getElementById('slotsTitle'), dateInput = document.getElementById('slotDate');

  function render(data) {
    box.textContent = '';
    if (!data.slots.length) {
      var p = document.createElement('p'); p.className = 'muted'; p.style.gridColumn = '1/-1';
      p.textContent = 'No openings on this day. Pick another date above.'; box.appendChild(p); return;
    }
    data.slots.forEach(function (s) {
      var b = document.createElement('button');
      if (s.free) { b.type = 'submit'; b.name = 'start_min'; b.value = s.start; b.className = 'slot'; b.textContent = s.label; }
      else {
        b.type = 'button'; b.disabled = true; b.className = 'slot taken'; b.textContent = s.label;
        var sm = document.createElement('small'); sm.textContent = s.state === 'past' ? 'Past' : 'Taken'; b.appendChild(sm);
      }
      box.appendChild(b);
    });
  }

  cal.addEventListener('click', function (e) {
    var btn = e.target.closest('button[name=date]');
    if (!btn || btn.disabled) return;
    e.preventDefault();
    var url = card.dataset.api + '?date=' + encodeURIComponent(btn.value) + '&barber=' + encodeURIComponent(card.dataset.barber || 'any') +
      (card.dataset.booking ? '&booking=' + encodeURIComponent(card.dataset.booking) : '');
    fetch(url, { headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('bad'); return r.json(); })
      .then(function (data) {
        render(data);
        dateInput.value = data.date;
        cal.querySelectorAll('button.on').forEach(function (x) { x.classList.remove('on'); });
        btn.classList.add('on');
        title.textContent = 'Time slots - ' + btn.getAttribute('aria-label');
      })
      .catch(function () { window.location.href = cal.action + '?date=' + encodeURIComponent(btn.value); }); // fall back to a normal page load
  });
})();
