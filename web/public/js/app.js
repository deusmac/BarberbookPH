/* BarberBook PH shared behavior: theme switch, toasts, confirm prompts. */
(function () {
  'use strict';
  var root = document.documentElement;

  function setTheme(t) {
    root.setAttribute('data-theme', t);
    document.cookie = 'bb_theme=' + t + ';path=/;max-age=31536000;SameSite=Lax';
    mark();
  }
  function mark() {
    var cur = root.getAttribute('data-theme');
    document.querySelectorAll('[data-theme-set]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-theme-set') === cur); });
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-theme-set]');
    if (t) setTheme(t.getAttribute('data-theme-set'));
  });
  mark();

  function toast(msg, type) {
    var box = document.getElementById('toasts');
    if (!box) return;
    var el = document.createElement('div');
    el.className = 'toast ' + (type || 'green');
    var icon = document.createElement('div'); icon.className = 'ti'; icon.textContent = type === 'red' ? '!' : '✓';
    var body = document.createElement('div'); body.className = 'tb'; body.textContent = msg;
    el.appendChild(icon); el.appendChild(body); box.appendChild(el);
    while (box.children.length > 3) box.removeChild(box.firstChild);
    setTimeout(function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 260); }, 4500);
  }
  window.BB = { toast: toast };

  var box = document.getElementById('toasts');
  if (box && box.dataset.flash) toast(box.dataset.flash);
  if (box && box.dataset.flashError) toast(box.dataset.flashError, 'red');

  // Forms with data-confirm ask first (no browser dialogs: use a second tap).
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f.dataset && f.dataset.confirm && f.dataset.confirmed !== '1') {
      var btn = f.querySelector('[type=submit]');
      if (btn && !btn.dataset.armed) {
        e.preventDefault();
        btn.dataset.armed = '1'; btn.dataset.label = btn.textContent; btn.textContent = f.dataset.confirm;
        setTimeout(function () { btn.textContent = btn.dataset.label; delete btn.dataset.armed; }, 4000);
      }
    }
  });
})();
