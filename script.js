function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".site-header .nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.textContent = isOpen ? "✕" : "☰";
  });
}

function initButtonScaleEffects() {
  const buttons = document.querySelectorAll(".btn, .nav-toggle");

  buttons.forEach((btn) => {
    btn.addEventListener("pointerenter", () => {
      btn.style.transform = "scale(1.08)";
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "scale(1)";
    });
    btn.addEventListener("pointerdown", () => {
      btn.style.transform = "scale(0.92)";
    });
    btn.addEventListener("pointerup", () => {
      btn.style.transform = "scale(1.08)";
    });
    btn.addEventListener("pointercancel", () => {
      btn.style.transform = "scale(1)";
    });
  });
}

document.addEventListener("DOMContentLoaded", initMobileNav);
document.addEventListener("DOMContentLoaded", initButtonScaleEffects);
