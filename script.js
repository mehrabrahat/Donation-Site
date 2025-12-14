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

// SSLCOMMERZ donation form submit
const donationForm = document.getElementById("donationForm");

if (donationForm) {
  donationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const cause = document.getElementById("cause").value;
    const amount = document.getElementById("amount").value.trim();
    const frequency =
      donationForm.querySelector('input[name="frequency"]:checked')?.value || "one-time";

    if (!fullName || !email || !amount || Number(amount) <= 0) {
      alert("Please fill in all required fields and enter a valid amount.");
      return;
    }

    const formData = new FormData();
    formData.append("cus_name", fullName);
    formData.append("cus_email", email);
    formData.append("amount", amount);
    formData.append("cause", cause);
    formData.append("frequency", frequency);

    fetch("create-payment.php", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.GatewayPageURL) {
          window.location.href = data.GatewayPageURL;
        } else {
          console.error("SSLCOMMERZ error:", data);
          alert("Failed to connect to payment gateway. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Something went wrong. Please try again.");
      });
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
