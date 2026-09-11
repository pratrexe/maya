const startup = document.querySelector("#startup");
const desktop = document.querySelector("#desktop");

const bootProgress = document.querySelector("#boot-progress");
const bootFill = document.querySelector("#boot-fill");
const bootPercent = document.querySelector("#boot-percent");
const bootDetail = document.querySelector("#boot-detail");
const asciiSpinner = document.querySelector("#ascii-spinner");

const notesShortcut = document.querySelector("#notes-shortcut");
const notesWindow = document.querySelector("#notes-window");
const notesInput = document.querySelector("#notes-input");
const saveStatus = document.querySelector("#save-status");

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

// Keep the old key so existing Margin OS notes remain available.
const NOTES_KEY = "margin-os-notes";

let bootTimer;
let finishTimer;

function startMaya() {
  clearInterval(bootTimer);
  clearTimeout(finishTimer);

  startup.hidden = false;
  desktop.hidden = true;

  let progress = 0;
  let frame = 0;

  const frames = ["[ / ]", "[ — ]", "[ \\ ]", "[ | ]"];
  const duration = reducedMotion.matches ? 400 : 3200;
  const startedAt = performance.now();

  setProgress(0);
  bootDetail.textContent = "unfolding your workspace";
  asciiSpinner.textContent = frames[0];

  // A timed visual introduction, not actual OS boot progress.
  bootTimer = setInterval(() => {
    const elapsed = performance.now() - startedAt;
    progress = Math.min(100, Math.floor((elapsed / duration) * 100));

    setProgress(progress);

    if (!reducedMotion.matches) {
      asciiSpinner.textContent = frames[frame++ % frames.length];
    }

    if (progress < 35) {
      bootDetail.textContent = "unfolding your workspace";
    } else if (progress < 75) {
      bootDetail.textContent = "putting thoughts in place";
    } else {
      bootDetail.textContent = "a fresh start awaits";
    }

    if (progress >= 100) {
      clearInterval(bootTimer);

      asciiSpinner.textContent = "[ ✳ ]";
      bootDetail.textContent = "welcome to maya";

      finishTimer = setTimeout(() => {
        startup.hidden = true;
        desktop.hidden = false;

        updateClock();
        document.querySelector("#desktop-title").focus();
      }, reducedMotion.matches ? 0 : 350);
    }
  }, 80);
}

function setProgress(value) {
  bootFill.style.width = `${value}%`;
  bootPercent.textContent = `${value}%`;
  bootProgress.setAttribute("aria-valuenow", String(value));
}

document
  .querySelector("#restart-button")
  .addEventListener("click", startMaya);

// CLOCK

function updateClock() {
  const now = new Date();
  const clock = document.querySelector("#clock");

  clock.dateTime = now.toISOString();
  clock.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  document.querySelector("#date").textContent =
    now.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
}

updateClock();
setInterval(updateClock, 1000);

// NOTES

notesShortcut.addEventListener("click", () => {
  notesWindow.hidden = false;
  notesShortcut.setAttribute("aria-expanded", "true");
  notesInput.focus();
});

function closeNotes() {
  notesWindow.hidden = true;
  notesShortcut.setAttribute("aria-expanded", "false");
  notesShortcut.focus();
}

document
  .querySelector("#close-notes")
  .addEventListener("click", closeNotes);

notesWindow.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNotes();
  }
});

try {
  notesInput.value = localStorage.getItem(NOTES_KEY) ?? "";
} catch {
  saveStatus.textContent = "Local saving is unavailable.";
}

notesInput.addEventListener("input", () => {
  try {
    localStorage.setItem(NOTES_KEY, notesInput.value);
    saveStatus.textContent = "Saved in this browser.";
  } catch {
    saveStatus.textContent = "Could not save — keep a copy before leaving.";
  }
});

// Launch automatically.
startMaya();