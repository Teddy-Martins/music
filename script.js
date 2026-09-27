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

function initQuestionForm() {
  const form = document.getElementById("question-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  // Show our own messages instead of the browser's default pop-ups
  form.noValidate = true;

  const rules = [
    { id: "name", message: "Please enter your name (at least 2 characters).", isValid: (v) => v.length >= 2 },
    { id: "email", message: "Please enter a valid email address.", isValid: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) },
    { id: "message", message: "Please type your question (at least 10 characters).", isValid: (v) => v.length >= 10 },
  ];

  function checkField(rule) {
    const field = document.getElementById(rule.id);
    const error = document.getElementById(rule.id + "-error");
    const ok = rule.isValid(field.value.trim());
    error.textContent = ok ? "" : rule.message; // textContent keeps user input from being run as HTML
    if (ok) {
      field.removeAttribute("aria-invalid");
    } else {
      field.setAttribute("aria-invalid", "true");
    }
    return ok;
  }

  rules.forEach((rule) => {
    const field = document.getElementById(rule.id);
    field.addEventListener("blur", () => checkField(rule));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") checkField(rule);
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    const results = rules.map(checkField);
    const firstBad = rules.find((rule, i) => !results[i]);
    if (firstBad) {
      document.getElementById(firstBad.id).focus();
      return;
    }

    // Hidden spam-trap field: real visitors never fill it in
    if (form.elements["_honey"].value) return;

    const data = new FormData(form);
    rules.forEach((rule) => data.set(rule.id, data.get(rule.id).trim()));

    const button = form.querySelector("button[type='submit']");
    button.disabled = true;
    status.textContent = "Sending...";

    try {
      const response = await fetch(form.action.replace("formsubmit.co/", "formsubmit.co/ajax/"), {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const result = await response.json();
      if (!response.ok || String(result.success) === "false") throw new Error("Request failed");
      form.reset();
      status.className = "form-status is-success";
      status.textContent = "Thank you! Your question has been sent.";
    } catch (err) {
      status.className = "form-status is-error";
      status.textContent = "Sorry, something went wrong. Please try again.";
    }
    button.disabled = false;
  });
}

document.addEventListener("DOMContentLoaded", initMobileNav);
document.addEventListener("DOMContentLoaded", initButtonScaleEffects);
document.addEventListener("DOMContentLoaded", initQuestionForm);
