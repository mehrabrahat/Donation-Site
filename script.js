// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

// Footer year
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Manual Payment donation form submit
const donationForm = document.getElementById("donationForm");

if (donationForm) {
  donationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    alert(
      "Thank you! Please ensure you have completed the payment using the selected method. Our team will verify your donation shortly."
    );

    donationForm.reset();
  });
}


// Quick amount buttons -> hero input
const quickAmounts = document.getElementById("quickAmounts");
const heroAmountInput = document.getElementById("heroAmount");
const mainAmountInput = document.getElementById("amount");

if (quickAmounts && heroAmountInput) {
  quickAmounts.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-amount]");
    if (!btn) return;

    quickAmounts.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const amount = btn.getAttribute("data-amount");
    heroAmountInput.value = amount;
  });
}

// Hero "Continue to Payment" button -> scroll to form & prefill
const heroDonateBtn = document.getElementById("heroDonateBtn");

if (heroDonateBtn && heroAmountInput && mainAmountInput) {
  heroDonateBtn.addEventListener("click", () => {
    const value = heroAmountInput.value.trim();
    if (value && Number(value) > 0) {
      mainAmountInput.value = value;
    }
    const donateSection = document.getElementById("donate");
    if (donateSection) {
      donateSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// Cause donate buttons -> preselect cause + scroll
const causeButtons = document.querySelectorAll(".cause-donate-btn");
const causeSelect = document.getElementById("cause");

causeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const causeName = btn.getAttribute("data-cause");
    if (causeSelect && causeName) {
      causeSelect.value = causeName;
    }
    const donateSection = document.getElementById("donate");
    if (donateSection) {
      donateSection.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Fade-in on scroll (IntersectionObserver)
const faders = document.querySelectorAll(".fade-in-on-scroll");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  faders.forEach((el) => observer.observe(el));
} else {
  // Fallback: just show all
  faders.forEach((el) => el.classList.add("visible"));
}

// FAQ toggle
const faqQuestions = document.querySelectorAll(".faq-question");
faqQuestions.forEach((q) => {
  q.addEventListener("click", () => {
    const answer = q.nextElementSibling;
    if (!answer) return;
    answer.classList.toggle("open-faq");
  });
});

// ===============================
// Auto-connect Child → Donation
// ===============================

// Read child name from URL (if coming from child-profile page)
const urlParams = new URLSearchParams(window.location.search);
const selectedChild = urlParams.get("child");

if (selectedChild) {
  // Save child name for later use (safe + reusable)
  localStorage.setItem("selectedChild", selectedChild);
}

// If donation form exists, auto-fill child info
if (donationForm) {
  const savedChild = localStorage.getItem("selectedChild");

  if (savedChild) {
    // OPTIONAL: change cause dropdown text
    if (causeSelect) {
      causeSelect.value = "General Fund";
    }

    // OPTIONAL: show info to donor (recommended UX)
    const donateInfo = document.querySelector(".donate-info");
    if (donateInfo && !document.getElementById("childNotice")) {
      const notice = document.createElement("p");
      notice.id = "childNotice";
      notice.style.marginTop = "1rem";
      notice.style.color = "#fbbf77";
      notice.innerHTML = `You are supporting <strong>${savedChild}</strong>. Thank you for making a difference.`;
      donateInfo.appendChild(notice);
    }
  }
}
const paymentMethod = document.getElementById("paymentMethod");
const paymentInfo = document.getElementById("manualPaymentInfo");

if (paymentMethod && paymentInfo) {
  paymentMethod.addEventListener("change", () => {
    paymentInfo.style.display = "block";
    paymentInfo.querySelectorAll("div").forEach(div => div.style.display = "none");
    const selected = paymentInfo.querySelector(`[data-method="${paymentMethod.value}"]`);
    if (selected) selected.style.display = "block";
  });
}
