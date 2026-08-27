/**
 * Shake's Games — session theme engine.
 *
 * Clicking the "To play or not to play?" box generates a random bright
 * gradient that is applied to BOTH the box and the site header. The body
 * background, buttons, search bar and A–Z filter buttons are derived from
 * that gradient so everything stays legible. The active theme is persisted
 * in localStorage and re-applied on every page (index, play, about, …).
 */
(function () {
  "use strict";

  var LS_KEY = "sg_theme";

  // ---------- color helpers ----------
  function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    var a = s * Math.min(l, 1 - l);
    function fn(n) {
      var k = (n + h / 30) % 12;
      return l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
    }
    return [fn(0) * 255, fn(8) * 255, fn(4) * 255];
  }

  function relativeLuminance(rgb) {
    function c(v) {
      var x = v / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * c(rgb[0]) + 0.7152 * c(rgb[1]) + 0.0722 * c(rgb[2]);
  }

  function lum(h, s, l) {
    return relativeLuminance(hslToRgb(h, s, l));
  }

  function hexToRgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  // Dark text is used when the surface is bright enough. The generation code
  // keeps every gradient stop on the same side of this threshold so the
  // chosen text color is always legible (min ~4.6:1 on the gradient itself).
  var THRESHOLD = 0.32;
  // Dark themes cap their stop luminance well below the threshold so cream
  // text keeps ~5:1 contrast everywhere on the gradient.
  var DARK_MAX_LUM = 0.15;

  // ---------- theme generation ----------
  // Pick a "bright" (light-text-on-dark panels) or "dark" (cream text)
  // theme, then force every gradient stop to stay on the matching side of
  // the luminance threshold. Stops therefore never cross the point where a
  // single text color would become unreadable on part of the gradient.
  function generate() {
    var h = Math.floor(Math.random() * 360);
    var s = Math.floor(60 + Math.random() * 35); // 60-95% saturation (bright)
    var hue2 = (h + 40) % 360;
    var hue3 = (h + 320) % 360;
    var bright = Math.random() < 0.5;
    var hues = [h, hue2, hue3];

    function minLForBright(hue) {
      var lo = 10,
        hi = 92;
      while (hi - lo > 0.25) {
        var mid = (lo + hi) / 2;
        if (lum(hue, s, mid) >= THRESHOLD) hi = mid;
        else lo = mid;
      }
      return hi;
    }
    function maxLForDark(hue) {
      var lo = 6,
        hi = 92;
      while (hi - lo > 0.25) {
        var mid = (lo + hi) / 2;
        if (lum(hue, s, mid) < DARK_MAX_LUM) lo = mid;
        else hi = mid;
      }
      return lo;
    }

    var lower, upper;
    if (bright) {
      lower = Math.max(minLForBright(hues[0]), minLForBright(hues[1]), minLForBright(hues[2]));
      upper = Math.min(92, lower + 35);
      if (upper <= lower) upper = Math.min(92, lower + 8);
    } else {
      upper = Math.min(maxLForDark(hues[0]), maxLForDark(hues[1]), maxLForDark(hues[2]));
      lower = Math.max(6, upper - 34);
      if (lower >= upper) lower = Math.max(6, upper - 8);
    }

    function lv() {
      return lower + Math.random() * (upper - lower);
    }
    return {
      h: h,
      s: s,
      l1: lv(),
      l2: lv(),
      l3: lv(),
      l4: lv(),
      hue2: hue2,
      hue3: hue3,
      bright: bright,
    };
  }

  // ---------- CSS variables computed from a theme ----------
  // Return the lightness (L) at which hsl(hue, sat, L) reaches a target
  // luminance. Luminance is monotonic in L, so a binary search works.
  function LForLum(hue, s, targetLum) {
    var lo = 6,
      hi = 92;
    for (var i = 0; i < 40; i++) {
      var mid = (lo + hi) / 2;
      if (lum(hue, s, mid) < targetLum) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  }

  function computeVars(t) {
    var h = t.h,
      s = t.s,
      hue2 = t.hue2,
      hue3 = t.hue3,
      l1 = t.l1,
      l2 = t.l2,
      l3 = t.l3,
      l4 = t.l4;
    var avgL = (l1 + l2 + l3 + l4) / 4;

    // Legibility of text sitting on the gradient itself (box + header).
    var avgLum =
      (lum(h, s, l1) + lum(hue2, s, l2) + lum(hue3, s, l3) + lum(h, s, l4)) / 4;
    var gradientIsBright =
      typeof t.bright === "boolean" ? t.bright : avgLum > THRESHOLD;

    var brightText = gradientIsBright ? "#17351f" : "#fdf6e3";
    var brightShadow = gradientIsBright
      ? "none"
      : "0 1px 3px rgba(0, 0, 0, 0.55)";

    // Site backdrop: very light on bright themes, very dark on dark themes.
    var bg = gradientIsBright ? "#faf6ea" : "#0e1013";
    var bodyText = gradientIsBright ? "#1e4d2b" : "#ece5cf";

    // Panels (buttons / search bar / A–Z keys): a luminance band that is
    // clearly on the dark-text side of the threshold, sitting slightly
    // darker (bright themes) or slightly lighter (dark themes) than the
    // header backdrop. Guarantees >= ~4.6:1 contrast with dark text.
    var panelLum = gradientIsBright
      ? Math.min(0.9, Math.max(0.38, avgLum * 0.7))
      : Math.min(0.57, avgLum + 0.28);
    var panelL = LForLum(h, s, panelLum);
    var panelHoverLum = Math.min(0.96, panelLum + 0.06);
    var panelHoverL = LForLum(h, s, panelHoverLum);
    var panel2Lum = gradientIsBright
      ? Math.max(0.32, panelLum - 0.06)
      : Math.min(0.64, panelLum + 0.07);
    var panel2L = LForLum(h, s, panel2Lum);

    var panelText = "#16281c"; // dark text on panels (always >= 4.6:1)
    var pt = hexToRgb(panelText);
    var panelBorder = "rgba(" + pt.r + ", " + pt.g + ", " + pt.b + ", 0.35)";
    var panelPlaceholder =
      "rgba(" + pt.r + ", " + pt.g + ", " + pt.b + ", 0.55)";

    var grad =
      "linear-gradient(156deg, hsl(" + h + ", " + s + "%, " + l1 +
      "%), hsl(" + hue2 + ", " + s + "%, " + l2 +
      "%), hsl(" + hue3 + ", " + s + "%, " + l3 +
      "%), hsl(" + h + ", " + s + "%, " + l4 + "%))";

    return {
      "--sg-bg": bg,
      "--sg-text": bodyText,
      "--sg-header-grad": grad,
      "--sg-bright-text": brightText,
      "--sg-bright-shadow": brightShadow,
      "--sg-panel": "hsl(" + h + ", " + s + "%, " + panelL + "%)",
      "--sg-panel-text": panelText,
      "--sg-panel-hover": "hsl(" + h + ", " + s + "%, " + panelHoverL + "%)",
      "--sg-panel2": "hsl(" + h + ", " + s + "%, " + panel2L + "%)",
      "--sg-panel-border": panelBorder,
      "--sg-panel-placeholder": panelPlaceholder,
      "--sg-accent": panelText,
      "--sg-accent-text": "hsl(" + h + ", " + s + "%, " + panelL + "%)",
    };
  }

  // ---------- overrides applied on top of each page's own CSS ----------
  var THEME_CSS = '\
    body { background-color: var(--sg-bg) !important; color: var(--sg-text) !important; }\n\
    .navbar, .header { background-image: var(--sg-header-grad) !important; background-color: transparent !important; color: var(--sg-bright-text) !important; border-bottom-color: var(--sg-panel-border) !important; transition: background 0.6s ease, color 0.6s ease !important; }\n\
    .navbar { box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25) !important; }\n\
    .site-title { color: var(--sg-bright-text) !important; text-shadow: var(--sg-bright-shadow) !important; }\n\
    .header-logo, .header-logo span, .header-logo span:nth-child(1), .header-logo span:nth-child(2), .header .nav-links a { color: var(--sg-bright-text) !important; text-shadow: var(--sg-bright-shadow) !important; }\n\
    .menu-icon { color: var(--sg-bright-text) !important; }\n\
    .nav-btn { background: var(--sg-panel) !important; border-color: var(--sg-panel-border) !important; color: var(--sg-panel-text) !important; }\n\
    .nav-btn:hover { background: var(--sg-panel-hover) !important; color: var(--sg-panel-text) !important; }\n\
    .nav-btn.back-btn, .nav-btn.back-btn:hover { background: var(--sg-panel) !important; border-color: var(--sg-panel-border) !important; color: var(--sg-panel-text) !important; }\n\
    .search-bar { background-color: var(--sg-panel) !important; border-color: var(--sg-panel-border) !important; color: var(--sg-panel-text) !important; box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.12) !important; }\n\
    .search-bar::placeholder { color: var(--sg-panel-placeholder) !important; }\n\
    .search-bar:focus { background-color: var(--sg-panel-hover) !important; }\n\
    .search-results { background-color: var(--sg-panel) !important; border-color: var(--sg-panel-border) !important; color: var(--sg-panel-text) !important; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important; }\n\
    .search-results a { color: var(--sg-panel-text) !important; border-bottom-color: var(--sg-panel-border) !important; }\n\
    .search-results a:hover, .search-results a:focus { background: var(--sg-panel-hover) !important; outline: none !important; }\n\
    .updates-paragraph-text { background: var(--sg-header-grad) !important; color: var(--sg-bright-text) !important; text-shadow: var(--sg-bright-shadow) !important; }\n\
    .alpha-btn { background: var(--sg-panel) !important; border-color: var(--sg-panel-border) !important; color: var(--sg-panel-text) !important; }\n\
    .alpha-btn:hover { background: var(--sg-panel-hover) !important; color: var(--sg-panel-text) !important; }\n\
    .alpha-btn.active { background: var(--sg-panel-text) !important; border-color: var(--sg-panel-text) !important; color: var(--sg-panel) !important; }\n\
    h2 { color: var(--sg-text) !important; }\n\
    /* settings modal keeps its own light styling so it stays legible on any theme */\n\
    .settings-modal { color: #1e4d2b !important; }\n\
    .settings-modal h2, .settings-header h2 { color: #1e4d2b !important; }\n\
    /* play / legacy game pages */\n\
    .game-bar { background-color: var(--sg-panel) !important; color: var(--sg-panel-text) !important; }\n\
    .cards-section { background-color: var(--sg-panel) !important; color: var(--sg-panel-text) !important; }\n\
    .cards-section h2 { color: var(--sg-panel-text) !important; }\n\
    .game-container { background-color: var(--sg-panel) !important; }\n\
    .game-container iframe { background-color: var(--sg-bg) !important; }\n\
    .fullscreen-button { background-color: var(--sg-accent) !important; color: var(--sg-accent-text) !important; }\n\
    .fullscreen-button:hover { background-color: var(--sg-accent) !important; filter: brightness(1.2); }\n\
    .card-container .card { background-color: var(--sg-panel) !important; color: var(--sg-panel-text) !important; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5) !important; }\n\
    .card-container .card figcaption { color: var(--sg-panel-text) !important; }\n\
    .card-container .card:hover { box-shadow: 0 15px 30px rgba(0, 0, 0, 0.7) !important; }\n\
    .ad { background-color: var(--sg-panel2) !important; }\n\
    #redirectMessage h2, #redirectMessage p, #redirectMessage a { color: var(--sg-text) !important; }\n\
    /* about page */\n\
    .container .card { background-color: var(--sg-panel2) !important; color: var(--sg-panel-text) !important; }\n\
    .container .card h2, .container .card p, .container .card li { color: var(--sg-panel-text) !important; }\n\
    .discord-btn { background: var(--sg-panel) !important; border-color: var(--sg-panel-border) !important; color: var(--sg-panel-text) !important; }\n\
    .discord-btn:hover { background: var(--sg-panel-hover) !important; }\n';

  // ---------- apply ----------
  function apply(t) {
    if (!t || typeof t.h !== "number") return;
    var vars = computeVars(t);
    var root = document.documentElement;
    for (var k in vars) {
      if (Object.prototype.hasOwnProperty.call(vars, k)) {
        root.style.setProperty(k, vars[k]);
      }
    }
    var style = document.getElementById("sg-theme-style");
    if (!style) {
      style = document.createElement("style");
      style.id = "sg-theme-style";
      (document.head || document.documentElement).appendChild(style);
    }
    if (style.textContent !== THEME_CSS) style.textContent = THEME_CSS;
  }

  function save(t) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(t));
    } catch (e) {}
  }

  function applyFromStorage() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (raw) apply(JSON.parse(raw));
    } catch (e) {}
  }

  // Auto re-apply the saved theme once the DOM exists (same-origin mirrors
  // included — theme is stored per-origin in localStorage).
  function boot() {
    var state = document.readyState;
    if (state === "loading") {
      document.addEventListener("DOMContentLoaded", applyFromStorage);
    } else {
      applyFromStorage();
    }
  }

  window.SGTheme = {
    LS_KEY: LS_KEY,
    generate: generate,
    apply: apply,
    save: save,
    applyFromStorage: applyFromStorage,
    computeVars: computeVars,
  };

  boot();
})();