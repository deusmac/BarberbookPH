
/* ===== GLUE: actions, modals, toasts, navigation, path setter ===== */
const ACTIONS = {};   // data-act handlers: ACTIONS.name(dataset, event)
const MODALS = {};    // MODALS[type](modalState) -> inner html of the modal card (shell wraps backdrop + .modal)
function toast(msg, type) { // type: green (default) | amber | red | blue
  const box = $("#toasts"); if (!box) return;
  const el = document.createElement("div"); el.className = "toast " + (type || "green");
  const ic = type === "amber" ? "bell" : type === "red" ? "x" : type === "blue" ? "info" : "check";
  el.innerHTML = `<div class="ti">${icon(ic, 20)}</div><div class="tb">${esc(msg)}</div>`;
  box.appendChild(el); while (box.children.length > 3) box.firstChild.remove();
  setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 260); }, 4000);
}
function openModal(m) { state.ui.modal = m; commit(); }
function closeModal() { state.ui.modal = null; commit(); }
function go(route) { location.hash = "#/c/" + route; }          // customer route, e.g. "home", "book/style"
function setPath(path, value) {                                  // path from state root, e.g. "draft.prefs.notes"
  const keys = path.split("."); let o = state;
  for (let i = 0; i < keys.length - 1; i++) { if (o[keys[i]] == null) o[keys[i]] = {}; o = o[keys[i]]; }
  o[keys[keys.length - 1]] = value;
}
const splitOn = () => state.ui.split && window.innerWidth >= 1280;
