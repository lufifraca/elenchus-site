// The one place to change the contact email.
const CONTACT_EMAIL = "luca@exetast.com";

// Every element with data-contact becomes a mailto link to CONTACT_EMAIL.
// data-subject adds a subject line; data-show-email shows the address as the link text.
document.querySelectorAll("[data-contact]").forEach((a) => {
  const subject = a.dataset.subject ? "?subject=" + encodeURIComponent(a.dataset.subject) : "";
  a.href = "mailto:" + CONTACT_EMAIL + subject;
  if ("showEmail" in a.dataset) a.textContent = CONTACT_EMAIL;
});

// Hero transcript replay. Without JS (or with reduced motion) the full transcript just shows.
(function () {
  const box = document.querySelector(".replay");
  if (!box || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.documentElement.classList.add("js");

  const steps = [...box.querySelectorAll("[data-step]")];
  const gold = box.querySelector(".gold");
  const btn = box.querySelector(".replay-btn");
  const texts = steps.map((s) => s.querySelector("[data-text]")?.textContent ?? "");
  let run = 0;
  const wait = (ms, id) => new Promise((r, x) => setTimeout(() => (id === run ? r() : x()), ms));

  async function type(el, text, id, speed) {
    el.classList.add("typing");
    for (let i = 1; i <= text.length; i++) { el.textContent = text.slice(0, i); await wait(speed, id); }
    el.classList.remove("typing");
  }

  async function count(from, to, id) {
    for (let v = from; v <= to; v += 3) { gold.textContent = v; await wait(18, id); }
    gold.textContent = to;
  }

  async function play() {
    const id = ++run;
    box.classList.remove("done"); btn.hidden = true;
    gold.textContent = gold.dataset.from;
    steps.forEach((s, i) => { s.classList.remove("on", "gone"); const t = s.querySelector("[data-text]"); if (t) t.textContent = ""; });
    try {
      await wait(500, id);
      for (let i = 0; i < steps.length; i++) {
        const s = steps[i], kind = s.dataset.step;
        if (kind === "think") { s.classList.add("on"); await wait(1100, id); s.classList.add("gone"); continue; }
        s.classList.add("on");
        if (kind === "type") await type(s.querySelector("[data-text]"), texts[i], id, s.classList.contains("player") ? 32 : 18);
        if (kind === "tool") { await wait(350, id); await count(+gold.dataset.from, +gold.dataset.to, id); box.classList.add("done"); await wait(600, id); }
        await wait(350, id);
      }
      btn.hidden = false;
    } catch (_) { /* superseded by a newer run */ }
  }

  btn.addEventListener("click", play);
  new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) { obs.disconnect(); play(); }
  }, { threshold: 0.4 }).observe(box);
})();

// "Why redacted?" pop-up note: one floating element, positioned next to the clicked bar.
(function () {
  const bars = document.querySelectorAll("button.redact.why");
  if (!bars.length) return;
  const note = document.createElement("div");
  note.className = "note-pop"; note.id = "why-note"; note.setAttribute("role", "tooltip");
  let current = null;

  function close() {
    if (!current) return;
    current.setAttribute("aria-expanded", "false"); current.removeAttribute("aria-describedby");
    note.remove(); current = null;
  }

  function open(bar) {
    close();
    note.textContent = bar.dataset.why;
    note.classList.remove("below");
    document.body.appendChild(note);
    const r = bar.getBoundingClientRect(), w = note.offsetWidth, h = note.offsetHeight, gap = 10;
    const pageW = document.documentElement.clientWidth;
    const centre = r.left + r.width / 2;
    const left = Math.max(8, Math.min(centre - w / 2, pageW - w - 8));
    let top = r.top - h - gap;
    if (top < 8) { top = r.bottom + gap; note.classList.add("below"); }
    note.style.left = left + window.scrollX + "px";
    note.style.top = top + window.scrollY + "px";
    note.style.setProperty("--arrow-x", Math.max(12, Math.min(centre - left, w - 12)) + "px");
    bar.setAttribute("aria-expanded", "true"); bar.setAttribute("aria-describedby", note.id);
    current = bar;
  }

  bars.forEach((bar) => {
    bar.removeAttribute("title"); // the pop-up replaces the native tooltip once JS runs
    bar.setAttribute("aria-expanded", "false");
    bar.addEventListener("click", (e) => { e.stopPropagation(); current === bar ? close() : open(bar); });
  });
  document.addEventListener("click", (e) => { if (!note.contains(e.target)) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  // The note is anchored in page coordinates, so it scrolls with the bar; on resize, re-place it.
  window.addEventListener("resize", () => { if (current) open(current); });
})();

// Desktop section rail: highlight the section currently in view.
(function () {
  const links = [...document.querySelectorAll(".rail a[data-rail]")];
  if (!links.length) return;
  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;
  const setActive = (id) => links.forEach((a) => a.classList.toggle("on", a === byId.get(id)));
  const io = new IntersectionObserver((entries) => {
    const vis = entries.filter((e) => e.isIntersecting);
    if (!vis.length) return;
    vis.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    setActive(vis[0].target.id);
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
  sections.forEach((s) => io.observe(s));
})();
