/* =========================================================
   J B ☁ — creator-card page interaction & payment prank
   Vanilla JS, no dependencies.
   ========================================================= */

(function () {
  "use strict";

  /* -------------------------------------------------------
     1. Footer year
  ------------------------------------------------------- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------------------------------------------
     2. Scroll reveal 
  ------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target); // reveal once
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible")); // fallback
  }

  /* -------------------------------------------------------
     3. Feed tab switching 
  ------------------------------------------------------- */
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      // Posts themselves stay as-is .
    });
  });

  /* -------------------------------------------------------
     4. Payment modal + prank sequence
  ------------------------------------------------------- */
  const RICKROLL_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

 
  const MESSAGES = [
    "Checking account...",
    "Verifying payment...",
    "Contacting bank...",
    "Confirming subscription...",
    "Scanning wallet...",
    "Calculating poor financial decisions...",
    "Contacting your ancestors...",
    "Generating disappointment...",
    "Finalizing...",
  ];

  const modal = document.getElementById("payment-modal");
  const statusEl = modal.querySelector("[data-status]");
  const progressEl = modal.querySelector("[data-progress]");
  const percentEl = modal.querySelector("[data-percent]");
  const processingStage = modal.querySelector('[data-stage="processing"]');
  const successStage = modal.querySelector('[data-stage="success"]');

  let isRunning = false; // guard against double-trigger

  function openModal() {
    if (isRunning) return; // already mid-sequence, ignore extra clicks
    isRunning = true;

    // Reset to processing view
    processingStage.hidden = false;
    successStage.hidden = true;
    setProgress(0);
    setStatus(MESSAGES[0]);

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    runSequence();
  }

  // progress bar + numeric label
  function setProgress(pct) {
    const value = Math.max(0, Math.min(100, pct));
    progressEl.style.width = value + "%";
    percentEl.textContent = Math.round(value) + "%";
  }

  // status line gentle fade
  function setStatus(text) {
    statusEl.style.opacity = "0";
    setTimeout(() => {
      statusEl.textContent = text;
      statusEl.style.opacity = "1";
    }, 140);
  }

  // The sequence 
  function runSequence() {
    let step = 0;
    const total = MESSAGES.length; // 9

    const intervalId = setInterval(() => {
      step += 1;

      if (step < total) {
        setStatus(MESSAGES[step]);
        // Map step 
        const pct = Math.round((step / (total - 1)) * 99);
        setProgress(pct);
      } else if (step === total) {
        // Reached exactly 99%
        setStatus(MESSAGES[total - 1]); // "Finalizing..."
        setProgress(99);
        clearInterval(intervalId);

        // dramatic effect
        setTimeout(() => {
          setProgress(100);
          showSuccess();
        }, 2000);
      }
    }, 1000);
  }

  function showSuccess() {
    processingStage.hidden = true;
    successStage.hidden = false;

    // (the rickroll).
    setTimeout(() => {
      window.location.href = RICKROLL_URL;
    }, 1500);
  }

  // Wire up every Subscribe / Like / Tip / Unlock / post / bundle
  document.querySelectorAll("[data-subscribe]").forEach((el) => {
    el.addEventListener("click", openModal);
  });
})();
