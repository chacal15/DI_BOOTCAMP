export const TAU = Math.PI * 2;

export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const lerp = (a, b, t) => a + (b - a) * t;
export const invLerp = (a, b, value) => (value - a) / (b - a || 1);
export const random = (min, max) => min + Math.random() * (max - min);
export const randomInt = (min, max) => Math.floor(random(min, max + 1));
export const pick = (items) => items[Math.floor(Math.random() * items.length)];
export const chance = (probability) => Math.random() < probability;

/** Lissage indépendant du taux de rafraîchissement. */
export function damp(current, target, smoothing, dt) {
  return lerp(current, target, 1 - Math.exp(-smoothing * dt));
}

/** Ramène un angle dans [0, PI[ : les deux orbes sont diamétralement opposés. */
export function wrapPi(angle) {
  return ((angle % Math.PI) + Math.PI) % Math.PI;
}

/** Plus courte différence signée entre deux axes (période PI). */
export function angularDeltaPi(from, to) {
  let delta = wrapPi(to) - wrapPi(from);
  if (delta > Math.PI / 2) delta -= Math.PI;
  if (delta < -Math.PI / 2) delta += Math.PI;
  return delta;
}

export function formatScore(score, pad = false) {
  const value = Math.max(0, Math.floor(Number(score) || 0));
  const text = pad ? String(value).padStart(6, "0") : String(value);
  return text.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function hexToRgba(hex, alpha = 1) {
  const clean = hex.replace("#", "");
  const normalized = clean.length === 3
    ? clean.split("").map((char) => char + char).join("")
    : clean;
  const value = Number.parseInt(normalized, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function safeVibrate(pattern) {
  try {
    if ("vibrate" in navigator) navigator.vibrate(pattern);
  } catch {
    // Les vibrations sont un bonus : le jeu reste identique sans elles.
  }
}
