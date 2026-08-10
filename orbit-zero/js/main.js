import { AudioEngine } from "./audio.js";
import { OrbitGame } from "./game.js";
import { LocalStore, sanitizePilotName } from "./storage.js";
import { formatScore } from "./utils.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const elements = {
  canvas: $("#game-canvas"),
  screens: $$(".screen"),
  menuScreen: $("#menu-screen"),
  pauseScreen: $("#pause-screen"),
  gameoverScreen: $("#gameover-screen"),
  playButton: $("#play-button"),
  pauseButton: $("#pause-button"),
  resumeButton: $("#resume-button"),
  pauseHomeButton: $("#pause-home-button"),
  restartButton: $("#restart-button"),
  homeButton: $("#home-button"),
  soundButton: $("#sound-button"),
  pilotName: $("#pilot-name"),
  score: $("#score-value"),
  comboChip: $("#combo-chip"),
  combo: $("#combo-value"),
  energy: $("#energy-fill"),
  energyValue: $("#energy-value"),
  energyMeter: $(".energy-track"),
  callout: $("#callout"),
  flash: $("#screen-flash"),
  touchLeft: $("#touch-left"),
  touchRight: $("#touch-right"),
  touchPulse: $("#touch-pulse"),
  menuLeaderboard: $("#menu-leaderboard"),
  gameoverLeaderboard: $("#gameover-leaderboard"),
  recordBadge: $("#record-badge"),
  finalScore: $("#final-score-value"),
  statGates: $("#stat-gates"),
  statPerfects: $("#stat-perfects"),
  statCombo: $("#stat-combo"),
};

const store = new LocalStore();
const settings = store.getSettings();
const audio = new AudioEngine(settings.sound);
let currentScoreId = null;
let displayedMultiplier = 1;
let scoreAnimationFrame = 0;

function activateScreen(screen) {
  for (const item of elements.screens) {
    item.classList.toggle("active", item === screen);
    item.setAttribute("aria-hidden", item === screen ? "false" : "true");
  }
}

function hideScreens() {
  for (const screen of elements.screens) {
    screen.classList.remove("active");
    screen.setAttribute("aria-hidden", "true");
  }
}

function onStateChange(state) {
  document.body.dataset.state = state;

  if (state === "menu") activateScreen(elements.menuScreen);
  else if (state === "paused") activateScreen(elements.pauseScreen);
  else if (state === "gameover") {
    // Les statistiques sont injectées juste après par onGameOver.
  } else {
    hideScreens();
  }
}

function updateHUD(data) {
  elements.score.textContent = formatScore(data.score, true);
  elements.combo.textContent = `×${data.multiplier}`;
  elements.comboChip.classList.toggle("visible", data.combo > 0);

  if (data.multiplier !== displayedMultiplier) {
    displayedMultiplier = data.multiplier;
    elements.comboChip.classList.remove("bump");
    void elements.comboChip.offsetWidth;
    elements.comboChip.classList.add("bump");
  }

  const energy = Math.max(0, Math.min(100, data.energy));
  document.documentElement.style.setProperty("--energy", `${energy.toFixed(1)}%`);
  elements.energyValue.textContent = `${Math.round(energy)}%`;
  elements.energy.classList.toggle("low", energy < 36);
  elements.energyMeter.setAttribute("aria-valuenow", String(Math.round(energy)));
  elements.touchPulse.classList.toggle("disabled", !data.pulseReady);
  elements.touchPulse.setAttribute("aria-disabled", String(!data.pulseReady));
}

function showCallout(message, type = "normal") {
  elements.callout.textContent = message;
  elements.callout.className = type === "perfect" ? "perfect" : "";
  void elements.callout.offsetWidth;
  elements.callout.classList.add("show");
}

function flash(type) {
  elements.flash.className = "";
  void elements.flash.offsetWidth;
  elements.flash.classList.add(`flash-${type}`);
}

function renderLeaderboard(target, scores, highlightedId = null) {
  target.replaceChildren();
  const rows = [...scores];
  while (rows.length < 5) rows.push(null);

  rows.slice(0, 5).forEach((entry) => {
    const item = document.createElement("li");
    if (!entry) {
      item.className = "empty";
      const name = document.createElement("span");
      const score = document.createElement("span");
      name.className = "rank-name";
      score.className = "rank-score";
      name.textContent = "— LIBRE —";
      score.textContent = "0";
      item.append(name, score);
    } else {
      if (entry.id === highlightedId) item.classList.add("current");
      const name = document.createElement("span");
      const score = document.createElement("span");
      name.className = "rank-name";
      score.className = "rank-score";
      name.textContent = entry.name;
      score.textContent = formatScore(entry.score);
      item.append(name, score);
    }
    target.append(item);
  });
}

function refreshLeaderboards(highlightedId = null) {
  const scores = store.getScores();
  renderLeaderboard(elements.menuLeaderboard, scores, highlightedId);
  renderLeaderboard(elements.gameoverLeaderboard, scores, highlightedId);
}

function savePilot() {
  const pilot = sanitizePilotName(elements.pilotName.value);
  elements.pilotName.value = pilot;
  store.updateSettings({ pilot });
  return pilot;
}

function animateFinalScore(targetScore) {
  cancelAnimationFrame(scoreAnimationFrame);
  const duration = 520;
  const start = performance.now();

  const tick = (time) => {
    const progress = Math.min(1, (time - start) / duration);
    const eased = 1 - (1 - progress) ** 3;
    elements.finalScore.textContent = formatScore(Math.floor(targetScore * eased));
    if (progress < 1) scoreAnimationFrame = requestAnimationFrame(tick);
  };

  scoreAnimationFrame = requestAnimationFrame(tick);
}

function onGameOver(stats) {
  const result = store.addScore({
    name: savePilot(),
    score: stats.score,
    gates: stats.gates,
    perfects: stats.perfects,
  });

  currentScoreId = result.id;
  elements.statGates.textContent = String(stats.gates);
  elements.statPerfects.textContent = String(stats.perfects);
  elements.statCombo.textContent = `×${stats.maxMultiplier}`;
  elements.recordBadge.classList.toggle("visible", result.isNewRecord);
  renderLeaderboard(elements.gameoverLeaderboard, result.scores, currentScoreId);
  renderLeaderboard(elements.menuLeaderboard, result.scores, currentScoreId);
  activateScreen(elements.gameoverScreen);
  animateFinalScore(stats.score);
}

const game = new OrbitGame(elements.canvas, audio, {
  onStateChange,
  onHUD: updateHUD,
  onCallout: showCallout,
  onFlash: flash,
  onGameOver,
});

function beginGame() {
  savePilot();
  store.updateSettings({ hasPlayed: true });
  audio.unlock();
  displayedMultiplier = 1;
  elements.comboChip.classList.remove("visible", "bump");
  game.start();
}

function goHome() {
  audio.ui();
  game.showMenu();
  refreshLeaderboards();
}

function toggleSound() {
  const enabled = !audio.enabled;
  audio.setEnabled(enabled);
  store.updateSettings({ sound: enabled });
  elements.soundButton.setAttribute("aria-pressed", String(enabled));
  elements.soundButton.setAttribute("aria-label", enabled ? "Couper le son" : "Activer le son");
  if (enabled) audio.ui();
}

// Initialisation de l'interface persistante.
elements.pilotName.value = settings.pilot;
elements.soundButton.setAttribute("aria-pressed", String(settings.sound));
elements.soundButton.setAttribute("aria-label", settings.sound ? "Couper le son" : "Activer le son");
refreshLeaderboards();
activateScreen(elements.menuScreen);
updateHUD({ score: 0, combo: 0, multiplier: 1, energy: 100, pulseReady: true });

// Boutons principaux.
elements.playButton.addEventListener("click", beginGame);
elements.restartButton.addEventListener("click", beginGame);
elements.homeButton.addEventListener("click", goHome);
elements.pauseHomeButton.addEventListener("click", goHome);
elements.pauseButton.addEventListener("click", () => {
  audio.ui();
  game.pause();
});
elements.resumeButton.addEventListener("click", () => {
  audio.ui();
  game.resume();
});
elements.soundButton.addEventListener("click", toggleSound);

elements.pilotName.addEventListener("input", () => {
  const start = elements.pilotName.selectionStart;
  elements.pilotName.value = elements.pilotName.value
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 8);
  elements.pilotName.setSelectionRange(start, start);
});
elements.pilotName.addEventListener("change", savePilot);
elements.pilotName.addEventListener("blur", savePilot);

/** Boutons maintenus : Pointer Events permet souris, stylet et multitouch. */
function bindHoldButton(button, direction) {
  const pointers = new Set();

  const release = (event) => {
    pointers.delete(event.pointerId);
    if (pointers.size === 0) {
      game.setInput(direction, false);
      button.classList.remove("pressed");
    }
  };

  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    pointers.add(event.pointerId);
    button.setPointerCapture?.(event.pointerId);
    game.setInput(direction, true);
    button.classList.add("pressed");
  });
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("lostpointercapture", release);
}

bindHoldButton(elements.touchLeft, "left");
bindHoldButton(elements.touchRight, "right");

elements.touchPulse.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  elements.touchPulse.classList.add("pressed");
  game.activatePulse();
});
for (const eventName of ["pointerup", "pointercancel", "lostpointercapture"]) {
  elements.touchPulse.addEventListener(eventName, () => elements.touchPulse.classList.remove("pressed"));
}

// Le canvas lui-même agit comme deux grandes zones gauche / droite. Un glissé
// horizontal donne un contrôle direct plus précis sur téléphone.
let canvasPointer = null;
elements.canvas.addEventListener("pointerdown", (event) => {
  if (game.state !== "playing") return;
  event.preventDefault();
  elements.canvas.setPointerCapture?.(event.pointerId);
  canvasPointer = {
    id: event.pointerId,
    lastX: event.clientX,
    moved: 0,
  };
  game.setPointerAxis(event.clientX < window.innerWidth / 2 ? -1 : 1);
});

elements.canvas.addEventListener("pointermove", (event) => {
  if (!canvasPointer || canvasPointer.id !== event.pointerId || game.state !== "playing") return;
  const deltaX = event.clientX - canvasPointer.lastX;
  canvasPointer.lastX = event.clientX;
  canvasPointer.moved += Math.abs(deltaX);

  if (canvasPointer.moved > 7) {
    game.setPointerAxis(0);
    game.nudgeAngle(deltaX * 0.0095);
  } else {
    game.setPointerAxis(event.clientX < window.innerWidth / 2 ? -1 : 1);
  }
});

function releaseCanvasPointer(event) {
  if (!canvasPointer || canvasPointer.id !== event.pointerId) return;
  canvasPointer = null;
  game.setPointerAxis(0);
}

elements.canvas.addEventListener("pointerup", releaseCanvasPointer);
elements.canvas.addEventListener("pointercancel", releaseCanvasPointer);
elements.canvas.addEventListener("lostpointercapture", releaseCanvasPointer);
elements.canvas.addEventListener("contextmenu", (event) => event.preventDefault());

// Clavier : touches physiques et codes indépendants de la disposition AZERTY/QWERTY.
window.addEventListener("keydown", (event) => {
  const typing = document.activeElement === elements.pilotName;
  if (typing && event.code !== "Enter" && event.code !== "Escape") return;

  if (event.code === "ArrowLeft" || event.code === "KeyA" || event.code === "KeyQ") {
    event.preventDefault();
    game.setInput("left", true);
    return;
  }

  if (event.code === "ArrowRight" || event.code === "KeyD") {
    event.preventDefault();
    game.setInput("right", true);
    return;
  }

  if ((event.code === "Space" || event.code === "Enter") && !event.repeat) {
    event.preventDefault();
    if (typing) elements.pilotName.blur();
    if (game.state === "menu" || game.state === "gameover") beginGame();
    else if (game.state === "playing" && event.code === "Space") game.activatePulse();
    return;
  }

  if ((event.code === "KeyP" || event.code === "Escape") && !event.repeat) {
    if (game.state === "playing" || game.state === "paused") {
      event.preventDefault();
      audio.ui();
      game.togglePause();
    } else if (typing) {
      elements.pilotName.blur();
    }
    return;
  }

  if (event.code === "KeyR" && !event.repeat && game.state === "gameover") {
    event.preventDefault();
    beginGame();
    return;
  }

  if (event.code === "KeyM" && !event.repeat) toggleSound();
});

window.addEventListener("keyup", (event) => {
  if (event.code === "ArrowLeft" || event.code === "KeyA" || event.code === "KeyQ") game.setInput("left", false);
  if (event.code === "ArrowRight" || event.code === "KeyD") game.setInput("right", false);
});

window.addEventListener("blur", () => {
  game.resetInput();
  if (game.state === "playing") game.pause();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden && game.state === "playing") game.pause();
});

let resizeFrame = 0;
function scheduleResize() {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => game.resize());
}
window.addEventListener("resize", scheduleResize);
window.visualViewport?.addEventListener("resize", scheduleResize);
