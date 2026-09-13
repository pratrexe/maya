/* ═══════════════════════════════════════════════════════════
   MAYA OS — v0.4
   ═══════════════════════════════════════════════════════════ */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => r.querySelectorAll(s);
const gsap = window.gsap;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const startTime = Date.now();

/* ═══ THEME ═══ */
const themes = ["lavender", "mint", "peach", "blue", "rose"];
const themeNames = {
  lavender: "Lavender", mint: "Mint", peach: "Peach", blue: "Cosmic", rose: "Rose"
};

function applyTheme(t) {
  if (!themes.includes(t)) return;
  document.documentElement.dataset.theme = t;
  $$("[data-theme]").forEach(b => b.classList.toggle("active", b.dataset.theme === t));
  const sys = $("#sys-theme");
  if (sys) sys.textContent = themeNames[t];
  try { localStorage.setItem("maya-theme", t); } catch {}
}
try { applyTheme(localStorage.getItem("maya-theme") || "lavender"); } catch { applyTheme("lavender"); }

/* ═══ BOOT ═══ */
const bootPhrases = [
  { p: 20, t: "Waking up your space" },
  { p: 45, t: "Aligning orbits" },
  { p: 70, t: "Gathering good energy" },
  { p: 92, t: "Setting the room" },
  { p: 100, t: "Welcome home" }
];
let bootPhase = -1;
const bootState = { progress: 0 };

function updateBoot() {
  const v = Math.round(bootState.progress);
  const pctEl = $("#boot-percent");
  const barEl = $("#boot-bar");
  if (pctEl) pctEl.textContent = `${v}%`;
  if (barEl) barEl.style.width = `${v}%`;
  const idx = bootPhrases.findIndex(p => v <= p.p);
  if (idx !== bootPhase && idx !== -1) {
    bootPhase = idx;
    const el = $("#boot-status");
    if (!el) return;
    if (gsap && !reduced) {
      gsap.to(el, { opacity: 0, y: -4, duration: 0.15, onComplete: () => {
        el.textContent = bootPhrases[idx].t;
        gsap.to(el, { opacity: 1, y: 0, duration: 0.2 });
      }});
    } else {
      el.textContent = bootPhrases[idx].t;
    }
  }
}

function revealOS() {
  $("#boot").hidden = true;
  $("#os").hidden = false;
  updateClock();
  initOS();

  if (!gsap || reduced) return;

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from(".menubar", { y: -32, opacity: 0, duration: 0.6 })
    .from(".desk-icon", { x: -30, opacity: 0, scale: 0.9, duration: 0.5, stagger: 0.04 }, "-=0.4")
    .from(".widget", { x: 40, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.5")
    .from(".dock", { y: 60, opacity: 0, scale: 0.9, duration: 0.7, ease: "back.out(1.4)" }, "-=0.4");
}

function startBoot() {
  if (reduced) { bootState.progress = 100; updateBoot(); setTimeout(revealOS, 200); return; }
  if (gsap) {
    gsap.from(".boot-header, .boot-footer", { opacity: 0, duration: 0.6, stagger: 0.1 });
    gsap.from(".boot-sigil", { scale: 0.6, opacity: 0, duration: 0.9, ease: "back.out(1.3)" });
    gsap.from(".boot-eyebrow", { y: 12, opacity: 0, duration: 0.6, delay: 0.3 });
    gsap.from(".line-a", { y: 40, opacity: 0, duration: 0.7, delay: 0.4, ease: "power4.out" });
    gsap.from(".line-b", { y: 40, opacity: 0, duration: 0.7, delay: 0.55, ease: "power4.out" });
    gsap.from(".boot-signature", { y: 10, opacity: 0, duration: 0.6, delay: 0.75 });
    gsap.from(".boot-progress-card", { y: 20, opacity: 0, duration: 0.6, delay: 0.6 });

    gsap.to(bootState, {
      progress: 100, duration: 2.8, ease: "power1.inOut",
      onUpdate: updateBoot,
      onComplete: () => {
        gsap.to("#boot", { opacity: 0, duration: 0.5, delay: 0.3, ease: "power2.inOut", onComplete: revealOS });
      }
    });
  } else {
    const s = performance.now();
    const tick = (n) => {
      bootState.progress = Math.min(100, ((n - s) / 1500) * 100);
      updateBoot();
      if (bootState.progress < 100) requestAnimationFrame(tick);
      else revealOS();
    };
    requestAnimationFrame(tick);
  }
}

/* ═══ WINDOW MANAGER ═══ */
let zTop = 50;
const appNames = {
  notes: "Notes", appearance: "Appearance", soundscape: "Soundscape",
  breathe: "Breathe", terminal: "Terminal", system: "System"
};

function bringFront(win) {
  zTop += 1;
  win.style.zIndex = zTop;
  $$(".window").forEach(w => w.classList.remove("active"));
  win.classList.add("active");
  const active = $("#mb-active");
  if (active) active.textContent = appNames[win.dataset.app] || "Finder";
}

function openApp(id) {
  if (id === "home") {
    const open = $$(".window:not([hidden]):not(.minimized)");
    if (open.length) {
      open.forEach(w => w.classList.add("minimized"));
      const active = $("#mb-active"); if (active) active.textContent = "Finder";
    } else {
      $$(".window.minimized").forEach(w => w.classList.remove("minimized"));
    }
    return;
  }
  if (id === "trash") { toast("Trash is empty."); return; }

  const win = $(`#win-${id}`);
  if (!win) return;

  if (win.classList.contains("minimized")) {
    win.classList.remove("minimized");
    bringFront(win);
    return;
  }
  if (!win.hidden) { bringFront(win); return; }

  win.hidden = false;
  bringFront(win);
  $(`.dock-item[data-app="${id}"]`)?.classList.add("running");

  if (gsap && !reduced) {
    gsap.fromTo(win,
      { opacity: 0, scale: 0.94, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.28, ease: "power3.out" }
    );
  }
}

function closeApp(id) {
  const win = $(`#win-${id}`);
  if (!win) return;
  const done = () => {
    win.hidden = true;
    win.classList.remove("minimized", "maximized", "active");
    $(`.dock-item[data-app="${id}"]`)?.classList.remove("running");
    const active = $("#mb-active"); if (active) active.textContent = "Finder";
  };
  if (gsap && !reduced) {
    gsap.to(win, { opacity: 0, scale: 0.92, duration: 0.2, ease: "power2.in", onComplete: done });
  } else done();
}

function minApp(id) {
  const w = $(`#win-${id}`);
  if (w) {
    w.classList.add("minimized");
    w.classList.remove("active");
    const active = $("#mb-active"); if (active) active.textContent = "Finder";
  }
}

function maxApp(id) { $(`#win-${id}`)?.classList.toggle("maximized"); }

function initWM() {
  $$(".window").forEach(win => {
    win.addEventListener("mousedown", () => bringFront(win));
    const head = win.querySelector(".win-head");
    if (!head) return;

    head.querySelector(".tl.close")?.addEventListener("click", e => { e.stopPropagation(); closeApp(win.dataset.app); });
    head.querySelector(".tl.min")?.addEventListener("click", e => { e.stopPropagation(); minApp(win.dataset.app); });
    head.querySelector(".tl.max")?.addEventListener("click", e => { e.stopPropagation(); maxApp(win.dataset.app); });
    head.addEventListener("dblclick", e => {
      if (!e.target.closest(".tl, .win-tool")) maxApp(win.dataset.app);
    });

    // Drag
    let drag = false, sx = 0, sy = 0, il = 0, it = 0;
    head.addEventListener("pointerdown", e => {
      if (e.target.closest(".tl, .win-tool")) return;
      if (win.classList.contains("maximized")) return;
      drag = true;
      sx = e.clientX; sy = e.clientY;
      const r = win.getBoundingClientRect();
      il = r.left; it = r.top;
      try { head.setPointerCapture(e.pointerId); } catch {}
    });
    head.addEventListener("pointermove", e => {
      if (!drag) return;
      const nl = Math.max(-win.offsetWidth + 100, Math.min(window.innerWidth - 100, il + e.clientX - sx));
      const nt = Math.max(32, Math.min(window.innerHeight - 80, it + e.clientY - sy));
      win.style.left = `${nl}px`;
      win.style.top = `${nt}px`;
    });
    const stop = e => { if (drag) { drag = false; try { head.releasePointerCapture(e.pointerId); } catch {} } };
    head.addEventListener("pointerup", stop);
    head.addEventListener("pointercancel", stop);

    // Resize
    const rh = win.querySelector(".win-resize");
    if (rh) {
      let rz = false, rsx = 0, rsy = 0, iw = 0, ih = 0;
      rh.addEventListener("pointerdown", e => {
        e.stopPropagation();
        rz = true;
        rsx = e.clientX; rsy = e.clientY;
        iw = win.offsetWidth; ih = win.offsetHeight;
        try { rh.setPointerCapture(e.pointerId); } catch {}
      });
      rh.addEventListener("pointermove", e => {
        if (!rz) return;
        win.style.width = `${Math.max(360, iw + e.clientX - rsx)}px`;
        win.style.height = `${Math.max(260, ih + e.clientY - rsy)}px`;
      });
      const rstop = e => { if (rz) { rz = false; try { rh.releasePointerCapture(e.pointerId); } catch {} } };
      rh.addEventListener("pointerup", rstop);
      rh.addEventListener("pointercancel", rstop);
    }
  });
}

/* ═══ DOCK MAGNIFICATION ═══ */
function initDock() {
  const dock = $("#dock");
  if (!dock) return;
  const items = $$(".dock-item");

  dock.addEventListener("mousemove", e => {
    if (reduced || window.innerWidth < 768) return;
    const mx = e.clientX;
    items.forEach(item => {
      const r = item.getBoundingClientRect();
      const c = r.left + r.width / 2;
      const d = Math.abs(mx - c);
      const maxD = 140;
      if (d < maxD) {
        const s = 1 + 0.35 * Math.cos((d / maxD) * (Math.PI / 2));
        item.style.transform = `scale(${s.toFixed(3)}) translateY(-${((s - 1) * 16).toFixed(1)}px)`;
      } else item.style.transform = "";
    });
  });
  dock.addEventListener("mouseleave", () => items.forEach(i => i.style.transform = ""));

  items.forEach(item => {
    item.addEventListener("click", () => {
      const id = item.dataset.app;
      if (id) openApp(id);
    });
  });
  $("#dock-fs")?.addEventListener("click", toggleFS);
}

/* ═══ AUDIO ═══ */
let audioCtx = null, soundNodes = null, isPlaying = false, currentTrack = "rain";
let master = null, analyser = null, vizId = null;

function initAudio() {
  if (audioCtx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  audioCtx = new AC();
  master = audioCtx.createGain();
  master.gain.value = 0.65;
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 128;
  master.connect(analyser);
  analyser.connect(audioCtx.destination);
}

function startTrack(name) {
  initAudio();
  if (!audioCtx) return;
  if (audioCtx.state === "suspended") audioCtx.resume();
  stopNodes();
  currentTrack = name;

  if (name === "rain") {
    const bs = audioCtx.sampleRate * 2;
    const buf = audioCtx.createBuffer(1, bs, audioCtx.sampleRate);
    const d = buf.getChannelData(0);
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for (let i = 0; i < bs; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886*b0 + w*0.0555179; b1 = 0.99332*b1 + w*0.0750759;
      b2 = 0.969*b2 + w*0.153852; b3 = 0.8665*b3 + w*0.3104856;
      b4 = 0.55*b4 + w*0.5329522; b5 = -0.7616*b5 - w*0.016898;
      d[i] = (b0+b1+b2+b3+b4+b5+b6+w*0.5362) * 0.08; b6 = w*0.115926;
    }
    const src = audioCtx.createBufferSource(); src.buffer = buf; src.loop = true;
    const f = audioCtx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 800;
    src.connect(f); f.connect(master); src.start();
    soundNodes = [src, f];
  } else if (name === "cosmic") {
    const o1 = audioCtx.createOscillator(), o2 = audioCtx.createOscillator();
    o1.type = "sine"; o2.type = "sine";
    o1.frequency.value = 108; o2.frequency.value = 111.5;
    const g = audioCtx.createGain(); g.gain.value = 0.3;
    o1.connect(g); o2.connect(g); g.connect(master);
    o1.start(); o2.start();
    soundNodes = [o1, o2, g];
  } else if (name === "campfire") {
    const bs = audioCtx.sampleRate * 2;
    const buf = audioCtx.createBuffer(1, bs, audioCtx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bs; i++) {
      const r = Math.random();
      d[i] = r > 0.96 ? (Math.random()*2-1)*0.7 : (Math.random()*2-1)*0.03;
    }
    const src = audioCtx.createBufferSource(); src.buffer = buf; src.loop = true;
    const f = audioCtx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 1200;
    src.connect(f); f.connect(master); src.start();
    soundNodes = [src, f];
  }
  isPlaying = true;
  updateSoundUI();
  startViz();
}

function stopNodes() {
  if (soundNodes) {
    soundNodes.forEach(n => { try { if (n.stop) n.stop(); n.disconnect(); } catch {} });
    soundNodes = null;
  }
  isPlaying = false;
  if (vizId) { cancelAnimationFrame(vizId); vizId = null; }
  updateSoundUI();
}

function toggleSound() { isPlaying ? stopNodes() : startTrack(currentTrack); }

function updateSoundUI() {
  const names = { rain: "Gentle Rain", cosmic: "Cosmic Hum", campfire: "Zen Campfire" };
  const n = names[currentTrack];
  const setText = (sel, val) => { const el = $(sel); if (el) el.textContent = val; };

  setText("#mb-sound-label", isPlaying ? n : "Silent");
  $("#mb-bars")?.classList.toggle("silent", !isPlaying);
  $("#w-sound-dot")?.classList.toggle("active", isPlaying);
  setText("#w-track-name", n);
  setText("#w-track-mode", isPlaying ? "Playing" : "Paused");
  setText("#w-play", isPlaying ? "❚❚ Pause" : "▶ Play");
  setText("#ss-name", n);
  setText("#ss-mode", isPlaying ? "Playing · Ambient" : "Paused · Ambient");
  setText("#ss-play", isPlaying ? "❚❚ Pause" : "▶ Start");
  $("#cc-sound")?.classList.toggle("active", isPlaying);
  $$(".w-pill, .ss-card").forEach(e => e.classList.toggle("active", e.dataset.track === currentTrack));
}

function startViz() {
  if (vizId) return;
  const wcnv = $("#w-viz"), scnv = $("#ss-viz");
  const wc = wcnv?.getContext("2d");
  const sc = scnv?.getContext("2d");
  const data = new Uint8Array(64);

  function frame() {
    vizId = requestAnimationFrame(frame);
    if (analyser && isPlaying) analyser.getByteFrequencyData(data);
    else for (let i = 0; i < data.length; i++) data[i] = Math.sin(Date.now() * 0.003 + i * 0.3) * 8 + 10;

    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#c9b8ff";

    if (wc && wcnv) {
      wc.clearRect(0, 0, wcnv.width, wcnv.height);
      const n = 20, bw = wcnv.width / n - 1;
      for (let i = 0; i < n; i++) {
        const h = (data[i] / 255) * (wcnv.height - 4) + 3;
        wc.fillStyle = accent;
        wc.globalAlpha = 0.6 + (data[i] / 255) * 0.4;
        wc.fillRect(i * (bw + 1), wcnv.height - h, bw, h);
      }
      wc.globalAlpha = 1;
    }
    if (sc && scnv) {
      sc.clearRect(0, 0, scnv.width, scnv.height);
      const n = 48, bw = scnv.width / n - 2;
      for (let i = 0; i < n; i++) {
        const h = (data[i] / 255) * (scnv.height - 10) + 6;
        const grad = sc.createLinearGradient(0, scnv.height, 0, scnv.height - h);
        grad.addColorStop(0, accent); grad.addColorStop(1, "rgba(255,255,255,0.3)");
        sc.fillStyle = grad;
        sc.beginPath();
        if (sc.roundRect) sc.roundRect(i * (bw + 2), scnv.height - h, bw, h, 2);
        else sc.rect(i * (bw + 2), scnv.height - h, bw, h);
        sc.fill();
      }
    }
  }
  frame();
}

function initSoundscape() {
  $("#w-play")?.addEventListener("click", toggleSound);
  $("#ss-play")?.addEventListener("click", toggleSound);
  $("#mb-sound")?.addEventListener("click", toggleSound);
  $("#cc-sound")?.addEventListener("click", toggleSound);
  $$("[data-track]").forEach(e => e.addEventListener("click", () => startTrack(e.dataset.track)));

  const setVol = v => {
    if (master && audioCtx) master.gain.setValueAtTime(v / 100, audioCtx.currentTime);
    const cv = $("#cc-vol"); if (cv && cv.value != v) cv.value = v;
    const sv = $("#ss-vol"); if (sv && sv.value != v) sv.value = v;
    const cvv = $("#cc-vol-val"); if (cvv) cvv.textContent = v;
  };
  $("#cc-vol")?.addEventListener("input", e => setVol(e.target.value));
  $("#ss-vol")?.addEventListener("input", e => setVol(e.target.value));

  // Start viz idle loop
  startViz();
}

/* ═══ BREATHE ═══ */
let brTimer = null, brRunning = false, brPhase = 0, brSec = 0, brCycle = 0;
const brPhases = [
  { name: "Inhale", dur: 4, scale: 1.7, inst: "Breathe in slowly through your nose…" },
  { name: "Hold", dur: 7, scale: 1.7, inst: "Hold gently, still and calm…" },
  { name: "Exhale", dur: 8, scale: 1, inst: "Release slowly through your mouth…" },
  { name: "Rest", dur: 1, scale: 1, inst: "Rest, and prepare for the next…" }
];

function setBrScale(s, d) {
  const orb = $("#br-orb");
  if (orb) {
    orb.style.transition = `transform ${d}s cubic-bezier(0.4,0,0.2,1)`;
    orb.style.transform = `scale(${s})`;
  }
}

function brTick() {
  const p = brPhases[brPhase];
  brSec++;
  const setText = (sel, val) => { const el = $(sel); if (el) el.textContent = val; };
  setText("#br-timer", `${brSec}s / ${p.dur}s`);
  setText("#br-phase", p.name);
  setText("#br-instruction", p.inst);

  if (brSec >= p.dur) {
    brSec = 0;
    brPhase = (brPhase + 1) % brPhases.length;
    if (brPhase === 0) {
      brCycle++;
      setText("#br-cycles", `Cycle ${brCycle} of 4`);
      if (brCycle >= 4) {
        clearInterval(brTimer); brRunning = false;
        setBrScale(1, 1);
        setText("#br-toggle", "Begin Session");
        setText("#br-phase", "Complete");
        setText("#br-instruction", "Well done. Four cycles of calm.");
        brCycle = 0;
        return;
      }
    }
    const nx = brPhases[brPhase];
    setBrScale(nx.scale, nx.dur);
  }
}

function toggleBreathe() {
  const b = $("#br-toggle");
  if (brRunning) {
    clearInterval(brTimer); brRunning = false;
    if (b) b.textContent = "Begin Session";
    const ph = $("#br-phase"); if (ph) ph.textContent = "Paused";
    setBrScale(1, 1);
  } else {
    brRunning = true;
    if (b) b.textContent = "Pause";
    brPhase = 0; brSec = 0; brCycle = 0;
    const cyc = $("#br-cycles"); if (cyc) cyc.textContent = "Cycle 0 of 4";
    const f = brPhases[0];
    setBrScale(f.scale, f.dur);
    brTick();
    brTimer = setInterval(brTick, 1000);
  }
}

function initBreathe() { $("#br-toggle")?.addEventListener("click", toggleBreathe); }

/* ═══ TERMINAL ═══ */
const termHist = [];
let termIdx = -1;

function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

function execCmd(raw) {
  const cmd = raw.trim();
  if (!cmd) return;
  termHist.push(cmd); termIdx = termHist.length;
  const out = $("#term-out");
  if (!out) return;

  const line = document.createElement("div");
  line.className = "term-line";
  line.innerHTML = `<span class="term-hl">maya@desktop ~ %</span> ${esc(cmd)}`;
  out.appendChild(line);

  const parts = cmd.split(" ");
  const a = parts[0].toLowerCase();
  const arg = parts.slice(1).join(" ").toLowerCase();
  let r = "";

  switch (a) {
    case "help":
      r = `Available commands:
  <span class="term-hl">help</span>      Show this manual
  <span class="term-hl">neofetch</span>  System banner
  <span class="term-hl">theme</span>     Set theme &lt;lavender|mint|peach|blue|rose&gt;
  <span class="term-hl">sound</span>     Audio &lt;rain|cosmic|campfire|toggle&gt;
  <span class="term-hl">breathe</span>   Open breathing pacer
  <span class="term-hl">quote</span>     Inspirational thought
  <span class="term-hl">uptime</span>    Session duration
  <span class="term-hl">date</span>      Current date/time
  <span class="term-hl">whoami</span>    User info
  <span class="term-hl">clear</span>     Clear terminal`; break;
    case "clear": out.innerHTML = ""; return;
    case "neofetch":
      r = `<pre style="color:var(--accent);margin:0;font-family:inherit">
    ✳       OS:       MayaOS Web Edition v0.4
   ✳✳✳      Host:     Browser Runtime
  ✳✳✳✳✳     Kernel:   JavaScript
   ✳✳✳      Uptime:   ${uptimeStr()}
    ✳       Shell:    maya-cli
            Theme:    ${themeNames[document.documentElement.dataset.theme] || "Lavender"}
            Author:   Pratyush Rai</pre>`; break;
    case "theme":
      if (themes.includes(arg)) { applyTheme(arg); r = `Theme → <span class="term-hl">${arg}</span>`; }
      else r = `Unknown theme. Try: ${themes.join(", ")}`; break;
    case "quote":
      r = `"Room to breathe is a feature. Small things, good energy." — MAYA`; break;
    case "breathe": openApp("breathe"); r = "Opening breathe pacer…"; break;
    case "sound":
      if (arg === "toggle") { toggleSound(); r = `Sound ${isPlaying ? "on" : "off"}`; }
      else if (["rain","cosmic","campfire"].includes(arg)) { startTrack(arg); r = `Playing: ${arg}`; }
      else r = "Usage: sound &lt;rain|cosmic|campfire|toggle&gt;"; break;
    case "uptime": r = `Uptime: ${uptimeStr()}`; break;
    case "date": r = new Date().toString(); break;
    case "whoami": r = "pratyush@maya-os (creator)"; break;
    default: r = `command not found: ${esc(a)} — type <span class="term-hl">help</span>`;
  }
  if (r) {
    const l = document.createElement("div");
    l.className = "term-line"; l.innerHTML = r;
    out.appendChild(l);
  }
  out.scrollTop = out.scrollHeight;
}

function initTerm() {
  const inp = $("#term-input");
  if (!inp) return;
  inp.addEventListener("keydown", e => {
    if (e.key === "Enter") { const v = inp.value; inp.value = ""; execCmd(v); }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (termIdx > 0) { termIdx--; inp.value = termHist[termIdx] || ""; }
    }
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (termIdx < termHist.length - 1) { termIdx++; inp.value = termHist[termIdx] || ""; }
      else { termIdx = termHist.length; inp.value = ""; }
    }
  });
  $("#win-terminal")?.addEventListener("click", e => {
    if (!e.target.closest(".win-head, .tl, .win-tool, .win-resize")) inp.focus();
  });
}

/* ═══ SPOTLIGHT ═══ */
const spotActions = [
  { id: "notes", t: "Notes", c: "Application", i: "▤", a: () => openApp("notes") },
  { id: "appearance", t: "Appearance", c: "Application", i: "◐", a: () => openApp("appearance") },
  { id: "soundscape", t: "Soundscape", c: "Application", i: "♪", a: () => openApp("soundscape") },
  { id: "breathe", t: "Mindful Breathe", c: "Application", i: "✳", a: () => openApp("breathe") },
  { id: "terminal", t: "Terminal", c: "Application", i: ">_", a: () => openApp("terminal") },
  { id: "system", t: "System", c: "Application", i: "ⓘ", a: () => openApp("system") },
  ...themes.map(t => ({ id: `th-${t}`, t: `Theme: ${themeNames[t]}`, c: "Theme", i: "●", a: () => applyTheme(t) })),
  { id: "zen", t: "Toggle Zen Mode", c: "Mode", i: "☾", a: () => $("#cc-zen")?.click() },
  { id: "snd", t: "Toggle Sound", c: "Audio", i: "♪", a: toggleSound },
  { id: "fs", t: "Toggle Fullscreen", c: "System", i: "⛶", a: toggleFS },
  { id: "reload", t: "Restart", c: "System", i: "⟳", a: () => location.reload() }
];
let spotSel = 0;

function openSpot() {
  const sp = $("#spot");
  if (!sp) return;
  sp.hidden = false;
  const inp = $("#spot-input");
  if (inp) { inp.value = ""; inp.focus(); }
  spotSel = 0;
  renderSpot("");
}
function closeSpot() { const sp = $("#spot"); if (sp) sp.hidden = true; }

function renderSpot(q) {
  const c = $("#spot-results");
  if (!c) return;
  const ql = q.toLowerCase().trim();
  const m = spotActions.filter(a => a.t.toLowerCase().includes(ql) || a.c.toLowerCase().includes(ql));
  if (!m.length) { c.innerHTML = `<div class="spot-empty">No results for "${esc(q)}"</div>`; return; }
  c.innerHTML = "";
  m.forEach((it, i) => {
    const b = document.createElement("button");
    b.className = `spot-item ${i === spotSel ? "selected" : ""}`;
    b.innerHTML = `<div class="spot-item-l"><span class="spot-item-ico">${it.i}</span><span>${it.t}</span></div><span class="spot-tag">${it.c}</span>`;
    b.addEventListener("click", () => { closeSpot(); it.a(); });
    c.appendChild(b);
  });
}

function initSpot() {
  const inp = $("#spot-input"), bd = $("#spot");
  if (!inp || !bd) return;
  bd.addEventListener("click", e => { if (e.target === bd) closeSpot(); });
  inp.addEventListener("input", () => { spotSel = 0; renderSpot(inp.value); });
  inp.addEventListener("keydown", e => {
    const items = $$(".spot-item");
    if (!items.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); spotSel = (spotSel + 1) % items.length; updSpot(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); spotSel = (spotSel - 1 + items.length) % items.length; updSpot(); }
    else if (e.key === "Enter") { e.preventDefault(); items[spotSel]?.click(); }
    else if (e.key === "Escape") closeSpot();
  });
  function updSpot() {
    $$(".spot-item").forEach((it, i) => {
      it.classList.toggle("selected", i === spotSel);
      if (i === spotSel) it.scrollIntoView({ block: "nearest" });
    });
  }
  document.addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      bd.hidden ? openSpot() : closeSpot();
    } else if (e.key === "Escape") {
      closeSpot();
      const cc = $("#cc"); if (cc) cc.hidden = true;
      const ctx = $("#ctx"); if (ctx) ctx.hidden = true;
    }
  });
}

/* ═══ DESKTOP INTERACTIONS ═══ */
function initDesk() {
  const desk = $("#desktop");
  const mq = $("#marquee");
  const ctx = $("#ctx");
  const cc = $("#cc");
  if (!desk) return;

  document.addEventListener("click", e => {
    if (!e.target.closest("#mb-cc") && !e.target.closest("#cc") && cc) cc.hidden = true;
    if (!e.target.closest("#ctx") && ctx) ctx.hidden = true;
  });

  $("#mb-cc")?.addEventListener("click", e => {
    e.stopPropagation();
    if (cc) cc.hidden = !cc.hidden;
  });
  $("#mb-spotlight")?.addEventListener("click", openSpot);
  $("#mb-apple")?.addEventListener("click", () => openApp("system"));

  $("#cc-zen")?.addEventListener("click", () => {
    const os = $("#os");
    os.classList.toggle("zen");
    const on = os.classList.contains("zen");
    $("#cc-zen").classList.toggle("active", on);
    toast(on ? "Zen Mode on. Room to breathe." : "Zen Mode off.");
  });

  // Context menu
  desk.addEventListener("contextmenu", e => {
    if (e.target.closest(".window, .widget, .desk-icon")) return;
    e.preventDefault();
    if (!ctx) return;
    ctx.style.left = `${Math.min(window.innerWidth - 230, e.clientX)}px`;
    ctx.style.top = `${Math.min(window.innerHeight - 280, e.clientY)}px`;
    ctx.hidden = false;
  });
  $$(".ctx-item").forEach(b => b.addEventListener("click", () => {
    if (ctx) ctx.hidden = true;
    const a = b.dataset.ctx;
    if (a === "reload") location.reload();
    else openApp(a);
  }));

  // Desktop icons
  $$(".desk-icon").forEach(ic => {
    ic.addEventListener("click", () => {
      $$(".desk-icon").forEach(i => i.classList.remove("selected"));
      ic.classList.add("selected");
    });
    ic.addEventListener("dblclick", () => openApp(ic.dataset.app));
  });

  // Marquee
  let mA = false, mSX = 0, mSY = 0;
  desk.addEventListener("pointerdown", e => {
    if (e.target.closest(".window, .widget, .desk-icon")) return;
    if (e.button !== 0) return;
    mA = true; mSX = e.clientX; mSY = e.clientY;
    if (mq) {
      Object.assign(mq.style, { left: `${mSX}px`, top: `${mSY}px`, width: "0px", height: "0px" });
      mq.hidden = false;
    }
    try { desk.setPointerCapture(e.pointerId); } catch {}
  });
  desk.addEventListener("pointermove", e => {
    if (!mA || !mq) return;
    const l = Math.min(mSX, e.clientX), t = Math.min(mSY, e.clientY);
    const w = Math.abs(e.clientX - mSX), h = Math.abs(e.clientY - mSY);
    Object.assign(mq.style, { left: `${l}px`, top: `${t}px`, width: `${w}px`, height: `${h}px` });
    const rect = { l, t, r: l + w, b: t + h };
    $$(".desk-icon").forEach(ic => {
      const r = ic.getBoundingClientRect();
      const ov = !(r.right < rect.l || r.left > rect.r || r.bottom < rect.t || r.top > rect.b);
      ic.classList.toggle("selected", ov);
    });
  });
  const mStop = e => {
    if (mA) {
      mA = false;
      if (mq) mq.hidden = true;
      try { desk.releasePointerCapture(e.pointerId); } catch {}
    }
  };
  desk.addEventListener("pointerup", mStop);
  desk.addEventListener("pointercancel", mStop);
}

/* ═══ NOTES ═══ */
const NOTES_KEY = "maya-notes";
function initNotes() {
  const inp = $("#notes-input");
  const st = $("#notes-status");
  const w = $("#notes-words");
  const c = $("#notes-chars");
  if (!inp) return;

  try {
    inp.value = localStorage.getItem(NOTES_KEY) ||
      "Welcome to MayaOS.\n\nA little space. A lot of possibility.\nStart anywhere — your thoughts stay here.";
  } catch {
    if (st) st.textContent = "Local saving unavailable";
  }

  const upd = () => {
    const t = inp.value;
    const wc = t.trim() ? t.trim().split(/\s+/).length : 0;
    if (w) w.textContent = `${wc} words`;
    if (c) c.textContent = `${t.length} characters`;
  };
  upd();

  inp.addEventListener("input", () => {
    upd();
    try { localStorage.setItem(NOTES_KEY, inp.value); if (st) st.textContent = "Saved locally"; }
    catch { if (st) st.textContent = "Could not save"; }
  });

  $("#notes-new")?.addEventListener("click", () => { inp.value = ""; upd(); inp.focus(); toast("New note"); });
  $("#notes-clear")?.addEventListener("click", () => {
    inp.value = ""; upd();
    try { localStorage.removeItem(NOTES_KEY); } catch {}
    toast("Notes cleared");
  });
}

/* ═══ TELEMETRY ═══ */
function updateTele() {
  const setText = (sel, val) => { const el = $(sel); if (el) el.textContent = val; };
  setText("#sys-res", `${screen.width} × ${screen.height} @${devicePixelRatio}x`);
  setText("#sys-plat", navigator.platform || "Web");
  if (navigator.getBattery) {
    navigator.getBattery().then(b => {
      const upd = () => {
        const p = Math.round(b.level * 100);
        setText("#mb-battery", `${p}%${b.charging ? " ⚡" : ""}`);
        setText("#sys-bat", `${p}% ${b.charging ? "(Charging)" : "(Battery)"}`);
      };
      upd();
      b.addEventListener("levelchange", upd);
      b.addEventListener("chargingchange", upd);
    }).catch(() => setText("#mb-battery", "—"));
  } else setText("#mb-battery", "—");
}

/* ═══ CLOCK, FS, TOAST, UTIL ═══ */
function toggleFS() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => toast("Fullscreen unavailable"));
  } else document.exitFullscreen();
}

function uptimeStr() {
  const d = Math.floor((Date.now() - startTime) / 1000);
  return `${String(Math.floor(d/3600)).padStart(2,"0")}:${String(Math.floor((d%3600)/60)).padStart(2,"0")}:${String(d%60).padStart(2,"0")}`;
}

function updateClock() {
  const n = new Date();
  const t = n.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  const d = n.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  const fd = n.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
  const setText = (sel, val) => { const el = $(sel); if (el) el.textContent = val; };
  setText("#mb-clock", `${d}  ${t}`);
  setText("#w-time", t);
  setText("#w-date", fd);
  setText("#sys-up", uptimeStr());
}
setInterval(updateClock, 1000);

let toastT;
function toast(msg) {
  clearTimeout(toastT);
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  toastT = setTimeout(() => t.classList.remove("show"), 3000);
}

/* ═══ WALLPAPER STYLES ═══ */
function initWalls() {
  $$("[data-wall]").forEach(b => b.addEventListener("click", () => {
    $$("[data-wall]").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    toast(`Wallpaper: ${b.dataset.wall}`);
  }));
  $("#ap-blur")?.addEventListener("input", e => {
    document.documentElement.style.setProperty("--blur", `${e.target.value}px`);
  });
}

/* ═══ THEME SWATCH CLICKS ═══ */
function initThemeClicks() {
  $$("[data-theme]").forEach(b => {
    b.addEventListener("click", () => applyTheme(b.dataset.theme));
  });
}

/* ═══ INIT ═══ */
function initOS() {
  initWM();
  initDock();
  initSoundscape();
  initBreathe();
  initTerm();
  initSpot();
  initDesk();
  initNotes();
  initWalls();
  initThemeClicks();
  updateTele();
  setTimeout(() => openApp("notes"), 500);
}

startBoot();