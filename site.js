// The one place to change the contact email.
const CONTACT_EMAIL = "hello@example.com";

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

// Close an open "why redacted?" note when clicking anywhere else.
document.addEventListener("click", (e) => {
  document.querySelectorAll("details.why[open]").forEach((d) => { if (!d.contains(e.target)) d.open = false; });
});
