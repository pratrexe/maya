const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

let toastTimer;
const startTime = Date.now();

// ---------- SAVED APPEARANCE ----------

const themes = ["lavender", "mint", "peach", "blue", "rose"];

function applyTheme(theme) {
  if (!themes.includes(theme)) return;

  document.documentElement.dataset.theme = theme;

  $$("button[data-theme]").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.theme === theme)
    );
    if (button.classList.contains("swatch")) {
      button.style.outline = button.dataset.theme === theme ? "2px solid var(--text)" : "none";
    }
  });

  const sysTheme = $("#sys-theme");
  if (sysTheme) {
    const names = {
      lavender: "Lavender Glow",
      mint: "Fresh Mint",
      peach: "Warm Peach",
      blue: "Cosmic Blue",
      rose: "Rose Gold"
    };
    sysTheme.textContent = names[theme] || theme;
  }
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
      showToast("Color applied.");
    }
  });
});

// Wallpaper ambiance styles
function applyWallpaper(style) {
  const wp = $("#os-wallpaper");
  if (!wp) return;
  wp.className = `os-wallpaper wp-style-${style}`;
  $$("[data-wallpaper]").forEach((b) =>
    b.classList.toggle("active", b.dataset.wallpaper === style)
  );
}

$$("[data-wallpaper]").forEach((btn) => {
  btn.addEventListener("click", () => {
    applyWallpaper(btn.dataset.wallpaper);
  });
});

$("#slider-blur")?.addEventListener("input", (e) => {
  document.documentElement.style.setProperty("--glass-blur", `${e.target.value}px`);
});

// ---------- STARTUP ----------

// This progress represents a short visual introduction,
// not downloads, hardware initialization, or real OS loading.
const bootState = { progress: 0 };

const statusPhrases = [
  { threshold: 22, text: "Waking up your space…" },
  { threshold: 48, text: "Aligning orbits…" },
  { threshold: 75, text: "Gathering good energy…" },
  { threshold: 95, text: "Setting the room…" },
  { threshold: 100, text: "Welcome home." }
];
let currentPhaseIndex = -1;

function updateBoot() {
  const value = Math.min(100, Math.max(0, Math.round(bootState.progress)));
  const percentEl = $("#boot-percent");
  const barEl = $("#boot-progress-bar");
  const trackEl = $(".boot-progress-track");
  const statusEl = $("#boot-status");

  if (percentEl) percentEl.textContent = `${value}%`;
  if (barEl) barEl.style.width = `${value}%`;
  if (trackEl) trackEl.setAttribute("aria-valuenow", String(value));

  if (statusEl) {
    let phaseIndex = statusPhrases.findIndex((p) => value <= p.threshold);
    if (phaseIndex === -1) phaseIndex = statusPhrases.length - 1;
    if (phaseIndex !== currentPhaseIndex) {
      currentPhaseIndex = phaseIndex;
      const targetText = statusPhrases[phaseIndex].text;
      if (gsap && !reducedMotion) {
        gsap.to(statusEl, {
          opacity: 0,
          y: -3,
          duration: 0.12,
          onComplete: () => {
            statusEl.textContent = targetText;
            gsap.to(statusEl, { opacity: 1, y: 0, duration: 0.18 });
          }
        });
      } else {
        statusEl.textContent = targetText;
      }
    }
  }
}

function revealDesktop() {
  $("#boot").hidden = true;
  $("#desktop").hidden = false;

  updateClock();
  initWebOS();

  if (!gsap || reducedMotion) return;

  gsap.from(".os-menubar", {
    opacity: 0,
    y: -15,
    duration: 0.6,
    ease: "power3.out"
  });

  gsap.from(".desktop-icon", {
    opacity: 0,
    x: -20,
    scale: 0.85,
    duration: 0.6,
    stagger: 0.05,
    ease: "back.out(1.5)"
  });

  gsap.from(".desktop-widgets > *", {
    opacity: 0,
    x: 30,
    duration: 0.7,
    stagger: 0.1,
    ease: "power3.out"
  });

  gsap.from(".os-dock", {
    opacity: 0,
    y: 35,
    scale: 0.9,
    duration: 0.75,
    delay: 0.2,
    ease: "back.out(1.2)"
  });
}

function startBoot() {
  if (reducedMotion) {
    bootState.progress = 100;
    updateBoot();
    revealDesktop();
    return;
  }

  if (gsap) {
    gsap.from(".boot-header, .boot-footer", {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });

    gsap.from(".boot-stage", {
      opacity: 0,
      scale: 0.82,
      duration: 1,
      ease: "power3.out"
    });

    gsap.from(".boot-info > *", {
      opacity: 0,
      y: 16,
      duration: 0.75,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.1
    });

    gsap.from(".boot-loader-card", {
      opacity: 0,
      y: 20,
      scale: 0.95,
      duration: 0.8,
      delay: 0.25,
      ease: "power3.out"
    });

    gsap.to(".boot-flower", {
      rotation: 180,
      duration: 2.8,
      ease: "power2.inOut"
    });

    gsap.to(".boot-orbit-one", {
      rotation: -180,
      duration: 7,
      ease: "none",
      repeat: -1
    });

    gsap.to(".boot-orbit-two", {
      rotation: 180,
      duration: 9,
      ease: "none",
      repeat: -1
    });

    gsap.to(bootState, {
      progress: 100,
      duration: 2.7,
      ease: "power1.inOut",
      onUpdate: updateBoot,
      onComplete: () => {
        gsap.to("#boot", {
          opacity: 0,
          scale: 1.04,
          duration: 0.45,
          delay: 0.2,
          ease: "power2.inOut",
          onComplete: revealDesktop
        });
      }
    });

    return;
  }

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

// ========================================================
// WINDOW MANAGER (MWM)
// ========================================================

let topZIndex = 50;
const appNames = {
  notes: "Notes",
  appearance: "Appearance Studio",
  soundscape: "Soundscape Studio",
  breathe: "Mindful Breathe",
  terminal: "Terminal",
  system: "System Telemetry"
};

function bringToFront(win) {
  topZIndex += 1;
  win.style.zIndex = topZIndex;
  $$(".os-window").forEach((w) => w.classList.remove("active"));
  win.classList.add("active");
  const appId = win.dataset.app;
  const activeTitle = $("#active-app-title");
  if (activeTitle) activeTitle.textContent = appNames[appId] || "MayaOS";
}

function openApp(appId) {
  if (appId === "home") {
    const openWins = $$(".os-window:not([hidden]):not(.minimized)");
    if (openWins.length > 0) {
      openWins.forEach((w) => w.classList.add("minimized"));
      $("#active-app-title").textContent = "MayaOS";
    } else {
      $$(".os-window:not([hidden]).minimized").forEach((w) =>
        w.classList.remove("minimized")
      );
    }
    return;
  }
  if (appId === "trash") {
    showToast("Trash is empty. Your space is clear.");
    return;
  }

  const win = $(`#win-${appId}`);
  if (!win) return;

  if (win.classList.contains("minimized")) {
    win.classList.remove("minimized");
    bringToFront(win);
    return;
  }

  if (!win.hidden) {
    bringToFront(win);
    return;
  }

  win.hidden = false;
  bringToFront(win);

  const dockBtn = $(`.dock-item[data-app="${appId}"]`);
  if (dockBtn) dockBtn.classList.add("running");

  if (gsap && !reducedMotion) {
    gsap.fromTo(
      win,
      { opacity: 0, scale: 0.92, y: 15 },
      { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "power3.out" }
    );
  }
}

function closeApp(appId) {
  const win = $(`#win-${appId}`);
  if (!win) return;
  if (gsap && !reducedMotion) {
    gsap.to(win, {
      opacity: 0,
      scale: 0.9,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        win.hidden = true;
        win.classList.remove("minimized", "maximized", "active");
        const dockBtn = $(`.dock-item[data-app="${appId}"]`);
        if (dockBtn) dockBtn.classList.remove("running");
        $("#active-app-title").textContent = "MayaOS";
      }
    });
  } else {
    win.hidden = true;
    win.classList.remove("minimized", "maximized", "active");
    const dockBtn = $(`.dock-item[data-app="${appId}"]`);
    if (dockBtn) dockBtn.classList.remove("running");
    $("#active-app-title").textContent = "MayaOS";
  }
}

function minimizeApp(appId) {
  const win = $(`#win-${appId}`);
  if (!win) return;
  win.classList.add("minimized");
  win.classList.remove("active");
  $("#active-app-title").textContent = "MayaOS";
}

function maximizeApp(appId) {
  const win = $(`#win-${appId}`);
  if (!win) return;
  win.classList.toggle("maximized");
}

function initWindowManager() {
  $$(".os-window").forEach((win) => {
    win.addEventListener("mousedown", () => bringToFront(win));

    const header = win.querySelector(".window-header");
    if (!header) return;

    const closeBtn = header.querySelector(".win-btn.close");
    const minBtn = header.querySelector(".win-btn.minimize");
    const maxBtn = header.querySelector(".win-btn.maximize");

    closeBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      closeApp(win.dataset.app);
    });
    minBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      minimizeApp(win.dataset.app);
    });
    maxBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      maximizeApp(win.dataset.app);
    });

    header.addEventListener("dblclick", () => maximizeApp(win.dataset.app));

    // Pointer dragging with boundary checks
    let isDragging = false;
    let startX = 0,
      startY = 0,
      initialLeft = 0,
      initialTop = 0;

    header.addEventListener("pointerdown", (e) => {
      if (
        e.target.closest(".window-controls") ||
        e.target.closest(".window-actions")
      )
        return;
      if (win.classList.contains("maximized")) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = win.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      header.setPointerCapture(e.pointerId);
    });

    header.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;
      newTop = Math.max(34, Math.min(window.innerHeight - 80, newTop));
      newLeft = Math.max(
        -win.offsetWidth + 80,
        Math.min(window.innerWidth - 80, newLeft)
      );
      win.style.left = `${newLeft}px`;
      win.style.top = `${newTop}px`;
    });

    const stopDrag = (e) => {
      if (isDragging) {
        isDragging = false;
        try {
          header.releasePointerCapture(e.pointerId);
        } catch {}
      }
    };
    header.addEventListener("pointerup", stopDrag);
    header.addEventListener("pointercancel", stopDrag);

    // Resizing
    const resizeHandle = win.querySelector(".window-resize-handle");
    if (resizeHandle) {
      let isResizing = false;
      let resizeStartX = 0,
        resizeStartY = 0,
        initW = 0,
        initH = 0;

      resizeHandle.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        isResizing = true;
        resizeStartX = e.clientX;
        resizeStartY = e.clientY;
        initW = win.offsetWidth;
        initH = win.offsetHeight;
        resizeHandle.setPointerCapture(e.pointerId);
      });

      resizeHandle.addEventListener("pointermove", (e) => {
        if (!isResizing) return;
        const w = Math.max(320, initW + (e.clientX - resizeStartX));
        const h = Math.max(200, initH + (e.clientY - resizeStartY));
        win.style.width = `${w}px`;
        win.style.height = `${h}px`;
      });

      const stopResize = (e) => {
        if (isResizing) {
          isResizing = false;
          try {
            resizeHandle.releasePointerCapture(e.pointerId);
          } catch {}
        }
      };
      resizeHandle.addEventListener("pointerup", stopResize);
      resizeHandle.addEventListener("pointercancel", stopResize);
    }
  });
}

// ========================================================
// macOS MAGNIFYING DOCK
// ========================================================

function initDock() {
  const dock = $("#os-dock");
  if (!dock) return;
  const items = $$(".dock-item");

  dock.addEventListener("mousemove", (e) => {
    if (reducedMotion || window.innerWidth < 768) return;
    const mouseX = e.clientX;

    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distance = Math.abs(mouseX - center);
      const maxDistance = 135;

      if (distance < maxDistance) {
        const scale =
          1 + 0.38 * Math.cos((distance / maxDistance) * (Math.PI / 2));
        item.style.transform = `scale(${scale.toFixed(3)}) translateY(-${(
          (scale - 1) *
          18
        ).toFixed(1)}px)`;
      } else {
        item.style.transform = "scale(1) translateY(0)";
      }
    });
  });

  dock.addEventListener("mouseleave", () => {
    items.forEach((item) => {
      item.style.transform = "scale(1) translateY(0)";
    });
  });

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const appId = item.dataset.app;
      if (appId) openApp(appId);
    });
  });

  $("#dock-fullscreen")?.addEventListener("click", toggleFullscreen);
}

// ========================================================
// GENERATIVE WEB AUDIO SOUNDSCAPE STUDIO
// ========================================================

let audioCtx = null;
let soundNodes = null;
let isSoundPlaying = false;
let currentTrack = "rain";
let masterGain = null;
let analyser = null;
let visualizerAnimationId = null;

function initAudioContext() {
  if (audioCtx) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audioCtx = new AudioContext();

  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.65, audioCtx.currentTime);

  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 64;

  masterGain.connect(analyser);
  analyser.connect(audioCtx.destination);
}

function startSoundtrack(trackName) {
  initAudioContext();
  if (!audioCtx) return;
  if (audioCtx.state === "suspended") audioCtx.resume();

  stopCurrentSoundNodes();
  currentTrack = trackName;

  if (trackName === "rain") {
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, audioCtx.currentTime);

    noise.connect(filter);
    filter.connect(masterGain);
    noise.start();
    soundNodes = [noise, filter];
  } else if (trackName === "cosmic") {
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    osc1.type = "sine";
    osc2.type = "sine";
    osc1.frequency.setValueAtTime(108, audioCtx.currentTime);
    osc2.frequency.setValueAtTime(111.5, audioCtx.currentTime);

    const oscGain = audioCtx.createGain();
    oscGain.gain.setValueAtTime(0.3, audioCtx.currentTime);

    osc1.connect(oscGain);
    osc2.connect(oscGain);
    oscGain.connect(masterGain);

    osc1.start();
    osc2.start();
    soundNodes = [osc1, osc2, oscGain];
  } else if (trackName === "campfire") {
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const rand = Math.random();
      data[i] =
        rand > 0.96
          ? (Math.random() * 2 - 1) * 0.7
          : (Math.random() * 2 - 1) * 0.03;
    }

    const crackle = audioCtx.createBufferSource();
    crackle.buffer = buffer;
    crackle.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1200, audioCtx.currentTime);

    crackle.connect(filter);
    filter.connect(masterGain);
    crackle.start();
    soundNodes = [crackle, filter];
  }

  isSoundPlaying = true;
  updateSoundUI();
  startVisualizerLoop();
}

function stopCurrentSoundNodes() {
  if (soundNodes) {
    soundNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch {}
    });
    soundNodes = null;
  }
  isSoundPlaying = false;
  updateSoundUI();
}

function toggleSound() {
  if (isSoundPlaying) {
    stopCurrentSoundNodes();
  } else {
    startSoundtrack(currentTrack);
  }
}

function updateSoundUI() {
  const names = {
    rain: "Gentle Rain",
    cosmic: "Cosmic Hum",
    campfire: "Zen Campfire"
  };
  const name = names[currentTrack] || currentTrack;

  const btnText = $("#menubar-sound-text");
  if (btnText)
    btnText.textContent = isSoundPlaying
      ? `Soundscape: ${name}`
      : "Soundscape: Off";

  const wave = $("#menubar-sound-wave");
  if (wave) wave.classList.toggle("paused", !isSoundPlaying);

  const trayBtn = $("#btn-audio-toggle");
  if (trayBtn) {
    trayBtn.setAttribute("aria-pressed", String(isSoundPlaying));
    trayBtn.style.color = isSoundPlaying ? "var(--accent)" : "var(--muted)";
  }

  const wPlayBtn = $("#widget-play-icon");
  if (wPlayBtn) wPlayBtn.textContent = isSoundPlaying ? "❚❚ Pause" : "▶ Play";

  const appPlayBtn = $("#app-sound-toggle-btn");
  if (appPlayBtn)
    appPlayBtn.textContent = isSoundPlaying ? "❚❚ Stop Audio" : "▶ Start Audio";

  const wName = $("#widget-track-name");
  if (wName) wName.textContent = name;

  const aName = $("#app-sound-name");
  if (aName) aName.textContent = name;

  $$(".track-pill, .cc-preset-pill, .sound-preset-card").forEach((el) => {
    el.classList.toggle("active", el.dataset.track === currentTrack);
  });
}

function startVisualizerLoop() {
  if (visualizerAnimationId) return;

  const wCanvas = $("#widget-visualizer");
  const aCanvas = $("#app-visualizer");
  const wCtx = wCanvas?.getContext("2d");
  const aCtx = aCanvas?.getContext("2d");

  const dataArray = new Uint8Array(32);

  function draw() {
    visualizerAnimationId = requestAnimationFrame(draw);

    if (analyser && isSoundPlaying) {
      analyser.getByteFrequencyData(dataArray);
    } else {
      for (let i = 0; i < dataArray.length; i++) {
        dataArray[i] = Math.sin(Date.now() * 0.003 + i * 0.3) * 10 + 12;
      }
    }

    const accentColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "#d0bcff";

    if (wCtx && wCanvas) {
      wCtx.clearRect(0, 0, wCanvas.width, wCanvas.height);
      const barWidth = wCanvas.width / 16 - 2;
      for (let i = 0; i < 16; i++) {
        const h = (dataArray[i] / 255) * (wCanvas.height - 6) + 4;
        wCtx.fillStyle = accentColor;
        wCtx.beginPath();
        wCtx.roundRect(i * (barWidth + 2), wCanvas.height - h, barWidth, h, 2);
        wCtx.fill();
      }
    }

    if (aCtx && aCanvas) {
      aCtx.clearRect(0, 0, aCanvas.width, aCanvas.height);
      const barWidth = aCanvas.width / 32 - 3;
      for (let i = 0; i < 32; i++) {
        const h = (dataArray[i] / 255) * (aCanvas.height - 10) + 4;
        aCtx.fillStyle = accentColor;
        aCtx.beginPath();
        aCtx.roundRect(i * (barWidth + 3), aCanvas.height - h, barWidth, h, 3);
        aCtx.fill();
      }
    }
  }

  draw();
}

function initSoundscape() {
  $("#widget-play-btn")?.addEventListener("click", toggleSound);
  $("#app-sound-toggle-btn")?.addEventListener("click", toggleSound);
  $("#cc-sound-toggle")?.addEventListener("click", toggleSound);

  $$("[data-track]").forEach((el) => {
    el.addEventListener("click", () => {
      const track = el.dataset.track;
      startSoundtrack(track);
    });
  });

  const setVolume = (val) => {
    if (masterGain && audioCtx) {
      masterGain.gain.setValueAtTime(val / 100, audioCtx.currentTime);
    }
    const ccVol = $("#cc-volume");
    const appVol = $("#app-volume-slider");
    if (ccVol && ccVol.value != val) ccVol.value = val;
    if (appVol && appVol.value != val) appVol.value = val;
  };

  $("#cc-volume")?.addEventListener("input", (e) => setVolume(e.target.value));
  $("#app-volume-slider")?.addEventListener("input", (e) =>
    setVolume(e.target.value)
  );
}

// ========================================================
// MINDFUL BREATHE PACER
// ========================================================

let breatheTimer = null;
let breatheRunning = false;
let breathePhaseIndex = 0;
let breatheSeconds = 0;
let breatheCyclesCompleted = 0;

const breathePhases = [
  {
    name: "Inhale",
    duration: 4,
    scale: 1.6,
    instruction: "Breathe in deeply through your nose…"
  },
  {
    name: "Hold",
    duration: 7,
    scale: 1.6,
    instruction: "Gently hold your breath in calm stillness…"
  },
  {
    name: "Exhale",
    duration: 8,
    scale: 1,
    instruction: "Slowly release your breath through your mouth…"
  },
  {
    name: "Rest",
    duration: 1,
    scale: 1,
    instruction: "Rest and prepare for the next breath…"
  }
];

function setBreatheCircleScale(scale, duration) {
  const circle = $("#breathe-circle");
  if (circle) {
    circle.style.transition = `transform ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`;
    circle.style.transform = `scale(${scale})`;
  }
}

function updateBreatheTick() {
  const current = breathePhases[breathePhaseIndex];
  breatheSeconds++;

  const timerEl = $("#breathe-timer");
  const phaseEl = $("#breathe-phase");
  const instEl = $("#breathe-instruction");
  const cycleEl = $("#breathe-cycles");

  if (timerEl)
    timerEl.textContent = `${breatheSeconds}s / ${current.duration}s`;
  if (phaseEl) phaseEl.textContent = current.name;
  if (instEl) instEl.textContent = current.instruction;

  if (breatheSeconds >= current.duration) {
    breatheSeconds = 0;
    breathePhaseIndex = (breathePhaseIndex + 1) % breathePhases.length;
    if (breathePhaseIndex === 0) {
      breatheCyclesCompleted++;
      if (cycleEl) cycleEl.textContent = `Cycle ${breatheCyclesCompleted} of 4`;
    }
    const nextPhase = breathePhases[breathePhaseIndex];
    setBreatheCircleScale(nextPhase.scale, nextPhase.duration);
  }
}

function toggleBreatheSession() {
  const btn = $("#breathe-toggle-btn");
  if (breatheRunning) {
    clearInterval(breatheTimer);
    breatheRunning = false;
    if (btn) btn.textContent = "Start Session";
    $("#breathe-phase").textContent = "Paused";
    setBreatheCircleScale(1, 1);
  } else {
    breatheRunning = true;
    if (btn) btn.textContent = "Pause Session";
    breathePhaseIndex = 0;
    breatheSeconds = 0;
    const firstPhase = breathePhases[0];
    setBreatheCircleScale(firstPhase.scale, firstPhase.duration);
    updateBreatheTick();
    breatheTimer = setInterval(updateBreatheTick, 1000);
  }
}

function initBreathe() {
  $("#breathe-toggle-btn")?.addEventListener("click", toggleBreatheSession);
}

// ========================================================
// INTERACTIVE TERMINAL (maya-cli)
// ========================================================

const terminalHistory = [];
let historyIndex = -1;

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function executeCommand(rawCmd) {
  const cmd = rawCmd.trim();
  if (!cmd) return;

  terminalHistory.push(cmd);
  historyIndex = terminalHistory.length;

  const output = $("#terminal-output");
  if (!output) return;

  const cmdLine = document.createElement("div");
  cmdLine.className = "terminal-line";
  cmdLine.innerHTML = `<span class="terminal-prompt">maya@desktop ~ %</span> <span>${escapeHtml(
    cmd
  )}</span>`;
  output.appendChild(cmdLine);

  const parts = cmd.split(" ");
  const action = parts[0].toLowerCase();
  const arg = parts.slice(1).join(" ").toLowerCase();

  let response = "";

  switch (action) {
    case "help":
      response = `Available commands:
  • <span class="term-hl">help</span> - Show this help manual
  • <span class="term-hl">neofetch</span> - Display MayaOS system banner
  • <span class="term-hl">theme &lt;name&gt;</span> - Set theme (lavender, mint, peach, blue, rose)
  • <span class="term-hl">quote</span> - Display inspirational thought
  • <span class="term-hl">breathe</span> - Open guided breathing pacer
  • <span class="term-hl">sound &lt;rain|cosmic|campfire|toggle&gt;</span> - Audio controls
  • <span class="term-hl">uptime</span> - Display system session duration
  • <span class="term-hl">date</span> - Print current date and time
  • <span class="term-hl">clear</span> - Clear terminal window
  • <span class="term-hl">whoami</span> - Show user info`;
      break;
    case "clear":
      output.innerHTML = "";
      return;
    case "neofetch":
      response = `<pre style="color:var(--accent); margin:0;">
   *      *    OS: MayaOS Web Edition v0.4
  ***    ***   Host: Browser Web Assembly Runtime
 ***********   Uptime: ${getUptimeString()}
  *********    Shell: zsh (interactive JS parser)
   *******     Theme: ${document.documentElement.dataset.theme || "lavender"}
    *****      Author: Pratyush Rai
      *        Design: Material You + Hand-drawn
</pre>`;
      break;
    case "theme":
      if (themes.includes(arg)) {
        applyTheme(arg);
        response = `Theme changed to: <span class="term-hl">${arg}</span>`;
      } else {
        response = `Unknown theme. Choose from: ${themes.join(", ")}`;
      }
      break;
    case "quote":
      response = `"Room to breathe is a feature. Small things, good energy." — MAYA`;
      break;
    case "breathe":
      openApp("breathe");
      response = "Launching Mindful Breathe pacer…";
      break;
    case "sound":
      if (arg === "toggle") {
        toggleSound();
        response = `Soundscape ${isSoundPlaying ? "started" : "paused"}.`;
      } else if (["rain", "cosmic", "campfire"].includes(arg)) {
        startSoundtrack(arg);
        response = `Playing soundscape: ${arg}`;
      } else {
        response = "Usage: sound <rain|cosmic|campfire|toggle>";
      }
      break;
    case "uptime":
      response = `System uptime: ${getUptimeString()}`;
      break;
    case "date":
      response = new Date().toString();
      break;
    case "whoami":
      response = "pratyush@maya-os (Creator & Architect)";
      break;
    default:
      response = `command not found: ${escapeHtml(
        action
      )}. Type <span class="term-hl">help</span> for commands.`;
  }

  if (response) {
    const resLine = document.createElement("div");
    resLine.className = "terminal-line";
    resLine.innerHTML = response;
    output.appendChild(resLine);
  }

  output.scrollTop = output.scrollHeight;
}

function initTerminal() {
  const input = $("#terminal-input");
  if (!input) return;

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const val = input.value;
      input.value = "";
      executeCommand(val);
    } else if (e.key === "ArrowUp") {
      if (historyIndex > 0) {
        historyIndex--;
        input.value = terminalHistory[historyIndex] || "";
      }
    } else if (e.key === "ArrowDown") {
      if (historyIndex < terminalHistory.length - 1) {
        historyIndex++;
        input.value = terminalHistory[historyIndex] || "";
      } else {
        historyIndex = terminalHistory.length;
        input.value = "";
      }
    }
  });
}

// ========================================================
// SPOTLIGHT LAUNCHER
// ========================================================

const spotlightActions = [
  {
    id: "notes",
    title: "Notes",
    category: "Application",
    icon: "▤",
    action: () => openApp("notes")
  },
  {
    id: "appearance",
    title: "Appearance Studio",
    category: "Application",
    icon: "◐",
    action: () => openApp("appearance")
  },
  {
    id: "soundscape",
    title: "Soundscape Studio",
    category: "Application",
    icon: "♪",
    action: () => openApp("soundscape")
  },
  {
    id: "breathe",
    title: "Mindful Breathe",
    category: "Application",
    icon: "✳",
    action: () => openApp("breathe")
  },
  {
    id: "terminal",
    title: "Terminal (maya-cli)",
    category: "Application",
    icon: ">_",
    action: () => openApp("terminal")
  },
  {
    id: "system",
    title: "System Telemetry",
    category: "Application",
    icon: "ℹ",
    action: () => openApp("system")
  },
  {
    id: "theme-lavender",
    title: "Set Theme: Lavender",
    category: "Theme",
    icon: "●",
    action: () => applyTheme("lavender")
  },
  {
    id: "theme-mint",
    title: "Set Theme: Mint",
    category: "Theme",
    icon: "●",
    action: () => applyTheme("mint")
  },
  {
    id: "theme-peach",
    title: "Set Theme: Peach",
    category: "Theme",
    icon: "●",
    action: () => applyTheme("peach")
  },
  {
    id: "theme-blue",
    title: "Set Theme: Cosmic Blue",
    category: "Theme",
    icon: "●",
    action: () => applyTheme("blue")
  },
  {
    id: "theme-rose",
    title: "Set Theme: Rose Gold",
    category: "Theme",
    icon: "●",
    action: () => applyTheme("rose")
  },
  {
    id: "toggle-zen",
    title: "Toggle Zen Mode",
    category: "Mode",
    icon: "☁",
    action: () => $("#cc-zen-toggle")?.click()
  },
  {
    id: "toggle-sound",
    title: "Toggle Ambient Audio",
    category: "Audio",
    icon: "♪",
    action: toggleSound
  },
  {
    id: "toggle-fs",
    title: "Toggle Fullscreen",
    category: "System",
    icon: "⛶",
    action: toggleFullscreen
  },
  {
    id: "reboot",
    title: "Restart Startup",
    category: "System",
    icon: "⟳",
    action: () => location.reload()
  }
];

let selectedSpotlightIdx = 0;

function openSpotlight() {
  const backdrop = $("#spotlight-backdrop");
  const input = $("#spotlight-input");
  if (!backdrop || !input) return;
  backdrop.hidden = false;
  input.value = "";
  selectedSpotlightIdx = 0;
  renderSpotlightResults("");
  input.focus();
}

function closeSpotlight() {
  const backdrop = $("#spotlight-backdrop");
  if (backdrop) backdrop.hidden = true;
}

function renderSpotlightResults(query) {
  const container = $("#spotlight-results");
  if (!container) return;
  const q = query.toLowerCase().trim();
  const matches = spotlightActions.filter(
    (a) =>
      a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    container.innerHTML = `<div style="padding: 16px; text-align: center; color: var(--muted); font-size: 13px;">No results found for "${escapeHtml(
      query
    )}"</div>`;
    return;
  }

  container.innerHTML = "";
  matches.forEach((item, idx) => {
    const btn = document.createElement("button");
    btn.className = `spotlight-item ${
      idx === selectedSpotlightIdx ? "selected" : ""
    }`;
    btn.innerHTML = `
      <div class="spotlight-item-left">
        <span class="spotlight-item-icon">${item.icon}</span>
        <span>${item.title}</span>
      </div>
      <span class="spotlight-tag">${item.category}</span>
    `;
    btn.addEventListener("click", () => {
      closeSpotlight();
      item.action();
    });
    container.appendChild(btn);
  });
}

function initSpotlight() {
  const input = $("#spotlight-input");
  const backdrop = $("#spotlight-backdrop");

  backdrop?.addEventListener("click", (e) => {
    if (e.target === backdrop) closeSpotlight();
  });

  input?.addEventListener("input", () => {
    selectedSpotlightIdx = 0;
    renderSpotlightResults(input.value);
  });

  input?.addEventListener("keydown", (e) => {
    const items = $$(".spotlight-item");
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedSpotlightIdx = (selectedSpotlightIdx + 1) % items.length;
      updateSpotlightSelection();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedSpotlightIdx =
        (selectedSpotlightIdx - 1 + items.length) % items.length;
      updateSpotlightSelection();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const sel = items[selectedSpotlightIdx];
      if (sel) sel.click();
    } else if (e.key === "Escape") {
      closeSpotlight();
    }
  });

  function updateSpotlightSelection() {
    $$(".spotlight-item").forEach((it, idx) => {
      it.classList.toggle("selected", idx === selectedSpotlightIdx);
      if (idx === selectedSpotlightIdx) {
        it.scrollIntoView({ block: "nearest" });
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (backdrop && !backdrop.hidden) {
        closeSpotlight();
      } else {
        openSpotlight();
      }
    } else if (e.key === "Escape") {
      closeSpotlight();
      $$(".os-popover").forEach((p) => (p.hidden = true));
    }
  });
}

// ========================================================
// DESKTOP INTERACTIONS & POPUP MANAGERS
// ========================================================

function initDesktopInteractions() {
  const desktop = $("#os-desktop");
  const marquee = $("#selection-marquee");
  const contextMenu = $("#desktop-context-menu");
  const systemMenu = $("#system-menu");
  const controlCenter = $("#control-center");

  document.addEventListener("click", (e) => {
    if (
      !e.target.closest("#btn-apple-menu") &&
      !e.target.closest("#system-menu")
    ) {
      if (systemMenu) systemMenu.hidden = true;
    }
    if (
      !e.target.closest("#btn-control-center") &&
      !e.target.closest("#control-center")
    ) {
      if (controlCenter) controlCenter.hidden = true;
    }
    if (!e.target.closest("#desktop-context-menu")) {
      if (contextMenu) contextMenu.hidden = true;
    }
  });

  $("#btn-apple-menu")?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (systemMenu) systemMenu.hidden = !systemMenu.hidden;
  });

  $("#btn-control-center")?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (controlCenter) controlCenter.hidden = !controlCenter.hidden;
  });

  $("#btn-user-avatar")?.addEventListener("click", () => openApp("appearance"));
  $("#btn-spotlight")?.addEventListener("click", openSpotlight);
  $("#btn-audio-toggle")?.addEventListener("click", toggleSound);
  $("#btn-menubar-sound")?.addEventListener("click", toggleSound);

  $$(".menu-action").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (systemMenu) systemMenu.hidden = true;
      const action = btn.dataset.action;
      if (action === "about") openApp("system");
      if (action === "settings") openApp("appearance");
      if (action === "new-note") openApp("notes");
      if (action === "open-terminal") openApp("terminal");
      if (action === "lock")
        showToast("Desktop locked. Press any key to resume.");
      if (action === "reboot") location.reload();
    });
  });

  $("#cc-zen-toggle")?.addEventListener("click", () => {
    const btn = $("#cc-zen-toggle");
    desktop?.classList.toggle("zen-mode");
    const isZen = desktop?.classList.contains("zen-mode");
    btn?.classList.toggle("active", isZen);
    showToast(isZen ? "Zen Mode enabled. Room to breathe." : "Zen Mode off.");
  });

  $("#cc-fullscreen-toggle")?.addEventListener("click", toggleFullscreen);

  desktop?.addEventListener("contextmenu", (e) => {
    if (
      e.target.closest(".os-window") ||
      e.target.closest(".os-widget") ||
      e.target.closest(".desktop-icon")
    )
      return;
    e.preventDefault();
    if (!contextMenu) return;
    contextMenu.style.left = `${Math.min(
      window.innerWidth - 220,
      e.clientX
    )}px`;
    contextMenu.style.top = `${Math.min(
      window.innerHeight - 260,
      e.clientY
    )}px`;
    contextMenu.hidden = false;
  });

  $$(".context-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (contextMenu) contextMenu.hidden = true;
      const act = btn.dataset.contextAction;
      if (act === "new-note") openApp("notes");
      if (act === "appearance") openApp("appearance");
      if (act === "soundscape") openApp("soundscape");
      if (act === "breathe") openApp("breathe");
      if (act === "terminal") openApp("terminal");
      if (act === "system") openApp("system");
      if (act === "reboot") location.reload();
    });
  });

  $$(".desktop-icon").forEach((icon) => {
    icon.addEventListener("click", () => {
      $$(".desktop-icon").forEach((i) => i.classList.remove("selected"));
      icon.classList.add("selected");
    });
    icon.addEventListener("dblclick", () => {
      openApp(icon.dataset.app);
    });
  });

  let marqueeActive = false;
  let startX = 0,
    startY = 0;

  desktop?.addEventListener("pointerdown", (e) => {
    if (
      e.target.closest(".os-window") ||
      e.target.closest(".os-widget") ||
      e.target.closest(".desktop-icon")
    )
      return;
    if (e.button !== 0) return;
    marqueeActive = true;
    startX = e.clientX;
    startY = e.clientY;
    if (marquee) {
      marquee.style.left = `${startX}px`;
      marquee.style.top = `${startY}px`;
      marquee.style.width = "0px";
      marquee.style.height = "0px";
      marquee.hidden = false;
    }
    desktop.setPointerCapture(e.pointerId);
  });

  desktop?.addEventListener("pointermove", (e) => {
    if (!marqueeActive || !marquee) return;
    const currentX = e.clientX;
    const currentY = e.clientY;
    const left = Math.min(startX, currentX);
    const top = Math.min(startY, currentY);
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    marquee.style.left = `${left}px`;
    marquee.style.top = `${top}px`;
    marquee.style.width = `${width}px`;
    marquee.style.height = `${height}px`;

    const marqueeRect = {
      left,
      top,
      right: left + width,
      bottom: top + height
    };
    $$(".desktop-icon").forEach((icon) => {
      const r = icon.getBoundingClientRect();
      const overlaps = !(
        r.right < marqueeRect.left ||
        r.left > marqueeRect.right ||
        r.bottom < marqueeRect.top ||
        r.top > marqueeRect.bottom
      );
      icon.classList.toggle("selected", overlaps);
    });
  });

  const stopMarquee = (e) => {
    if (marqueeActive) {
      marqueeActive = false;
      if (marquee) marquee.hidden = true;
      try {
        desktop.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };
  desktop?.addEventListener("pointerup", stopMarquee);
  desktop?.addEventListener("pointercancel", stopMarquee);
}

// ========================================================
// NOTES AUTO-SAVING & TELEMETRY
// ========================================================

const NOTES_KEY = "margin-os-notes";

function initNotes() {
  const notesInput = $("#notes-input");
  const notesStatus = $("#notes-status");
  const wordCount = $("#notes-word-count");
  const charCount = $("#notes-char-count");

  if (!notesInput) return;

  try {
    notesInput.value =
      localStorage.getItem(NOTES_KEY) ||
      "Welcome to MayaOS.\n\nA little space. A lot of possibility.\nStart anywhere. Your thoughts stay here.";
  } catch {
    if (notesStatus) notesStatus.textContent = "Local saving is unavailable.";
  }

  function updateNotesStats() {
    const text = notesInput.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    if (wordCount) wordCount.textContent = `${words} words`;
    if (charCount) charCount.textContent = `${chars} characters`;
  }

  updateNotesStats();

  notesInput.addEventListener("input", () => {
    updateNotesStats();
    try {
      localStorage.setItem(NOTES_KEY, notesInput.value);
      if (notesStatus) notesStatus.textContent = "Saved locally.";
    } catch {
      if (notesStatus) notesStatus.textContent = "Could not save locally.";
    }
  });

  $("#notes-new-btn")?.addEventListener("click", () => {
    notesInput.value = "";
    updateNotesStats();
    notesInput.focus();
    showToast("New note created.");
  });

  $("#notes-clear-btn")?.addEventListener("click", () => {
    notesInput.value = "";
    updateNotesStats();
    try {
      localStorage.removeItem(NOTES_KEY);
    } catch {}
    showToast("Notes cleared.");
  });
}

function updateTelemetry() {
  const res = $("#sys-resolution");
  if (res)
    res.textContent = `${window.screen.width} × ${window.screen.height} (${window.devicePixelRatio}x)`;

  const platform = $("#sys-platform");
  if (platform) platform.textContent = navigator.platform || "Web Platform";

  if (navigator.getBattery) {
    navigator.getBattery().then((battery) => {
      const updateBat = () => {
        const pct = Math.round(battery.level * 100);
        const charging = battery.charging ? " ⚡" : "";
        const trayBat = $("#tray-battery");
        const sysBat = $("#sys-battery");
        if (trayBat)
          trayBat.innerHTML = `<span class="battery-level">${pct}%</span>${charging}`;
        if (sysBat)
          sysBat.textContent = `${pct}% ${
            battery.charging ? "(Charging)" : "(Battery)"
          }`;
      };
      updateBat();
      battery.addEventListener("levelchange", updateBat);
      battery.addEventListener("chargingchange", updateBat);
    });
  }
}

// ========================================================
// FULLSCREEN, CLOCK & UTILITIES
// ========================================================

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement
      .requestFullscreen()
      .catch(() => showToast("Fullscreen not allowed."));
  } else {
    document.exitFullscreen();
  }
}

function getUptimeString() {
  const diff = Math.floor((Date.now() - startTime) / 1000);
  const hrs = String(Math.floor(diff / 3600)).padStart(2, "0");
  const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
  const secs = String(diff % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
}

function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  const dateStr = now.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
  const fullDateStr = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  const trayClock = $("#tray-clock");
  if (trayClock) trayClock.textContent = `${dateStr}  ${timeStr}`;

  const wTime = $("#widget-clock-time");
  if (wTime) wTime.textContent = timeStr;

  const wDate = $("#widget-clock-date");
  if (wDate) wDate.textContent = fullDateStr;

  const uptime = $("#sys-uptime");
  if (uptime) uptime.textContent = getUptimeString();
}

setInterval(updateClock, 1000);

function showToast(message) {
  clearTimeout(toastTimer);
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// ========================================================
// INIT WEB OS
// ========================================================

function initWebOS() {
  initWindowManager();
  initDock();
  initSoundscape();
  initBreathe();
  initTerminal();
  initSpotlight();
  initDesktopInteractions();
  initNotes();
  updateTelemetry();

  setTimeout(() => {
    openApp("notes");
  }, 400);
}

startBoot();