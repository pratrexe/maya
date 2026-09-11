const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

let lenis;
let toastTimer;

// ---------- SAVED APPEARANCE ----------

const themes = ["lavender", "mint", "peach", "blue"];

function applyTheme(theme) {
  if (!themes.includes(theme)) return;

  document.documentElement.dataset.theme = theme;

  $$("[data-theme]").forEach((button) => {
    if (button.tagName !== "BUTTON") return;

    button.setAttribute(
      "aria-pressed",
      String(button.dataset.theme === theme)
    );
  });
}

try {
  applyTheme(localStorage.getItem("maya-theme") || "lavender");
} catch {
  applyTheme("lavender");
}

$$("button[data-theme]").forEach((button) => {
  button.addEventListener("click", () => {
    const theme = button.dataset.theme;
    applyTheme(theme);

    try {
      localStorage.setItem("maya-theme", theme);
    } catch {
      showToast("Color applied. This browser could not save it.");
    }
  });
});

// ---------- STARTUP ----------

// This progress represents a short visual introduction,
// not downloads, hardware initialization, or real OS loading.
const bootState = { progress: 0 };

function updateBoot() {
  const value = Math.round(bootState.progress);
  $("#boot-progress").value = value;
  $("#boot-percent").textContent = `${value}%`;
}

function revealDesktop() {
  $("#boot").hidden = true;
  $("#desktop").hidden = false;

  updateClock();
  $("#greeting").focus({ preventScroll: true });

  if (!gsap || reducedMotion) return;

  gsap.from(".topbar", {
    opacity: 0,
    y: -14,
    duration: 0.65,
    ease: "power3.out"
  });

  gsap.from(".hero-copy > *", {
    opacity: 0,
    y: 26,
    duration: 0.85,
    stagger: 0.1,
    ease: "power3.out"
  });

  gsap.from(".hero-art", {
    opacity: 0,
    scale: 0.85,
    rotation: -12,
    duration: 1.2,
    ease: "power3.out"
  });

  gsap.from(".dock", {
    opacity: 0,
    y: 24,
    duration: 0.8,
    delay: 0.35,
    ease: "power3.out"
  });

  initializeScrolling();
}

function startBoot() {
  if (reducedMotion) {
    bootState.progress = 100;
    updateBoot();
    revealDesktop();
    return;
  }

  if (gsap) {
    gsap.from(".boot-center", {
      opacity: 0,
      y: 18,
      duration: 0.65,
      ease: "power2.out"
    });

    gsap.to(".boot-symbol", {
      rotation: 180,
      duration: 2.8,
      ease: "power2.inOut"
    });

    gsap.to(bootState, {
      progress: 100,
      duration: 2.6,
      ease: "power1.inOut",
      onUpdate: updateBoot,
      onComplete: () => {
        gsap.to("#boot", {
          opacity: 0,
          duration: 0.35,
          delay: 0.15,
          onComplete: revealDesktop
        });
      }
    });

    return;
  }

  // Keep MAYA usable if the animation CDN is unavailable.
  const started = performance.now();

  function fallbackBoot(now) {
    bootState.progress = Math.min(100, ((now - started) / 1200) * 100);
    updateBoot();

    if (bootState.progress < 100) {
      requestAnimationFrame(fallbackBoot);
    } else {
      revealDesktop();
    }
  }

  requestAnimationFrame(fallbackBoot);
}

// ---------- SCROLL / GSAP SYNC ----------

function initializeScrolling() {
  if (ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  if (window.Lenis) {
    lenis = new window.Lenis({
      duration: 1.05,
      smoothWheel: true,
      anchors: true
    });

    if (ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
    }

    // Lenis expects milliseconds; GSAP's ticker supplies seconds.
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
  }

  if (!ScrollTrigger) return;

  gsap.utils.toArray(".card").forEach((card) => {
    gsap.from(card, {
      opacity: 0,
      y: 32,
      duration: 0.75,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 94%",
        once: true
      }
    });
  });

  ScrollTrigger.refresh();

  if (document.fonts) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

// ---------- CLOCK ----------

function updateClock() {
  const now = new Date();

  $("#clock").dateTime = now.toISOString();
  $("#clock").textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  $("#date").textContent = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
}

updateClock();
setInterval(updateClock, 1000);

// ---------- APP WINDOWS ----------

// Native dialogs provide focus trapping and Escape-to-close.
$$("[data-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = document.getElementById(button.dataset.open);

    lenis?.stop();
    dialog.showModal();

    if (gsap && !reducedMotion) {
      gsap.fromTo(
        dialog,
        { opacity: 0, y: 20, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power3.out",
          clearProps: "transform,opacity"
        }
      );
    }
  });
});

$$("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    button.closest("dialog").close();
  });
});

$$("dialog").forEach((dialog) => {
  dialog.addEventListener("close", () => {
    lenis?.start();
  });
});

// ---------- NOTES ----------

// Retain notes created by your earlier versions.
const NOTES_KEY = "margin-os-notes";

function updateNotePreview() {
  const text = $("#notes-input").value.trim();

  $("#note-preview").textContent = text
    ? text.slice(0, 180)
    : "That idea you don’t want to forget? Put it here.";
}

try {
  $("#notes-input").value = localStorage.getItem(NOTES_KEY) || "";
} catch {
  $("#save-status").textContent = "Local saving is unavailable.";
}

updateNotePreview();

$("#notes-input").addEventListener("input", () => {
  updateNotePreview();

  try {
    localStorage.setItem(NOTES_KEY, $("#notes-input").value);
    $("#save-status").textContent = "Saved only in this browser.";
  } catch {
    $("#save-status").textContent =
      "Could not save. Copy your notes before closing this page.";
  }
});

// ---------- FULLSCREEN ----------

$("#fullscreen-button").addEventListener("click", async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    } else {
      showToast("Fullscreen is not available in this browser.");
    }
  } catch {
    showToast("Fullscreen was blocked by this browser.");
  }
});

document.addEventListener("fullscreenchange", () => {
  $("#fullscreen-label").textContent =
    document.fullscreenElement ? "Shrink" : "Expand";
});

// ---------- FEEDBACK ----------

function showToast(message) {
  clearTimeout(toastTimer);
  $("#toast").textContent = message;

  toastTimer = setTimeout(() => {
    $("#toast").textContent = "";
  }, 3500);
}

startBoot();