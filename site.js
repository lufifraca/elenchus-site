// The one place to change the contact email.
const CONTACT_EMAIL = "hello@example.com";

// Every element with data-contact becomes a mailto link to CONTACT_EMAIL.
// data-subject adds a subject line; data-show-email shows the address as the link text.
document.querySelectorAll("[data-contact]").forEach((a) => {
  const subject = a.dataset.subject ? "?subject=" + encodeURIComponent(a.dataset.subject) : "";
  a.href = "mailto:" + CONTACT_EMAIL + subject;
  if ("showEmail" in a.dataset) a.textContent = CONTACT_EMAIL;
});
