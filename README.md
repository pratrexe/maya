# MAYA

A personal web desktop that feels like your own little world.

MAYA is a front-end experiment inspired by **Material You** and hand-drawn interfaces. It opens with an orbital cosmic startup screen, a flowing signature for **Pratyush Rai**, and a smooth transition into a desktop workspace with a live clock, a scratchpad notes app, and customizable accent colors.

> **Note:** MAYA is a **website**, not a real operating system. Everything runs in your browser. Notes are saved locally in that browser and never leave your device.

--- 
  
## Features 
 
* **Startup sequence** — Orbital flower animation, dynamic status cues, glowing progress bar, and handwritten-style signature.
* **Material-inspired design** — Dark palette by default, tonal surfaces, oversized typography, and soft pill controls.
* **Live clock & date** — Updates every second.
* **Notes app** — A simple text area stored in `localStorage`. Edits save automatically and appear on the home card.
* **Appearance picker** — Switch between four accent colors; your choice is saved for next time.
* **Fullscreen mode** — Expand to the entire screen with a button in the dock.
* **Smooth scrolling** — Lenis + GSAP ticker for buttery page movement and scroll-triggered card reveals.
* **Accessibility** — Keyboard focus, Escape to close dialogs, reduced-motion support, and semantic HTML.

---

## Getting Started

No build tools or installs are required. Just open the project in a browser.

### Option 1: Direct Open

1. Download or clone this repository.
2. Open `index.html` in any modern browser:

   * Chrome
   * Firefox
   * Edge
   * Safari

### Option 2: Live Server

For development, **Live Server** is recommended.

If you use VS Code:

1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
2. Right-click `index.html`.
3. Select **Open with Live Server**.

The page will automatically reload whenever you edit the files.

---

## Project Structure

```text
maya/
├── index.html      # Markup and structure
├── style.css       # Styling, themes, and responsive rules
├── app.js          # Startup logic, interactions, localStorage, smooth scrolling
└── README.md       # Project documentation
```

No images are required. All icons and artwork are created using text, Unicode characters, or CSS shapes.

---

## 🛠 Tech Stack

| Tool                   | Use                                  |
| ---------------------- | ------------------------------------ |
| **HTML5 / CSS3**       | Structure and styling                |
| **JavaScript (ES6)**   | Interactivity and state              |
| **GSAP**               | Startup animation and card entrances |
| **GSAP ScrollTrigger** | Scroll-linked reveals                |
| **Lenis**              | Smooth scrolling                     |
| **Google Fonts**       | Manrope and Great Vibes              |

All libraries are loaded from CDN. The page is designed to remain usable if external animation libraries fail to load, with reduced motion as a fallback.

---

## Customization

### Change Accent Color

The **Style** app (or the **PR** avatar) opens an appearance dialog.

Choose from four accent colors. Your selection is saved in `localStorage` under:

```text
maya-theme
```

You can also change the default accent by editing the `--accent` CSS variable in `styles.css`.

### Change the Signature Name

The signature **Pratyush Rai** appears in `index.html`.

Replace the text inside:

```html
<p class="signature">
```

and update the corresponding footer text in the desktop interface.

### Adjust Startup Duration

The startup progress animation is controlled by GSAP in `app.js`.

Modify the `duration` value in the relevant:

```javascript
gsap.to(bootState, {
    ...
});
```

call.

---

## Notes Data

Your notes are stored locally in your browser using `localStorage`.

The notes are stored under:

```text
margin-os-notes
```

They stay on your device and are never uploaded by MAYA.

**Important:** Clearing your browser's site data or local storage will remove your saved notes.

---

## Accessibility

MAYA includes several accessibility features:

* Semantic landmarks such as `<header>`, `<main>`, `<nav>`, and `<dialog>`
* Keyboard navigation and focus management
* Visible focus outlines
* Escape key support for closing dialogs
* `prefers-reduced-motion` support
* Reduced animations and smooth scrolling when requested by the operating system
* ARIA labels for icon-only buttons

---

## 🌐 Live Demo

**MAYA:**
https://maya-h5vz5ajnq-pratrexes-projects.vercel.app/

---

## License

This project is free for personal use and learning.

If you share or build upon MAYA, please mention the original author:

**made with love by Pratyush Rai**

---

<p align="center">
  Made with curiosity, code, and a little bit of chaos.
</p>

<p align="center">
  <strong>MAYA</strong>
</p>
