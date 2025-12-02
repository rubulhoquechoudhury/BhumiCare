// Simple enhancements for BhumiCare marketing site

// Mobile navigation toggle
const navToggle = document.querySelector(".bc-nav-toggle");
const navLinks = document.querySelector(".bc-nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu when clicking a link (on mobile)
  navLinks.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement) {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Smooth scrolling for in-page links (basic, no polyfill)
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (event) {
    const href = this.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Contact form handler (front-end only demo)
function handleContactSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const status = document.getElementById("form-status");
  if (!status) return false;

  status.textContent = "Submitting your enquiry...";

  // Simulate async submission
  setTimeout(() => {
    status.textContent =
      "Thank you for reaching out. The BhumiCare team will contact you shortly.";

    if (form instanceof HTMLFormElement) {
      form.reset();
    }
  }, 700);

  return false;
}

// Expose handler globally for inline HTML attribute
window.handleContactSubmit = handleContactSubmit;

// Footer year
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = String(new Date().getFullYear());
}


