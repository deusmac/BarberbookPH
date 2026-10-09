/* Owner area behavior: walk-in time slots refresh. */
(function () {
  'use strict';
  var form = document.querySelector('form.walkin');
  if (!form) return;
  var timeBox = document.getElementById('timeBox');
  var sel = document.getElementById('start_min');

  function whenValue() {
    var r = form.querySelector('input[name=when]:checked');
    return r ? r.value : 'now';
  }
  function toggle() {
    if (timeBox) timeBox.classList.toggle('hide', whenValue() !== 'time');
  }
  function refresh() {
    if (!sel) return;
    var q = new URLSearchParams({
      service_id: form.service_id.value, style_id: form.style_id.value, barber_id: form.barber_id.value
    });
    fetch(form.dataset.slotsUrl + '?' + q.toString(), { headers: { 'Accept': 'application/json' }, credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) {
        sel.innerHTML = '';
        if (!rows.length) {
          var o = document.createElement('option'); o.value = ''; o.textContent = 'No free times left today'; sel.appendChild(o); return;
        }
        rows.forEach(function (s) {
          var o = document.createElement('option'); o.value = s.start; o.textContent = s.label; sel.appendChild(o);
        });
      })
      .catch(function () {});
  }
  form.addEventListener('change', function (e) {
    if (e.target.name === 'when') toggle();
    if (['service_id', 'style_id', 'barber_id'].indexOf(e.target.name) !== -1) refresh();
  });
  toggle();
})();
