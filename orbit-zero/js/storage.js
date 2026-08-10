const SCORE_KEY = "orbitZero.scores.v1";
const SETTINGS_KEY = "orbitZero.settings.v1";
const MAX_SCORES = 5;

function readJSON(key, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function sanitizePilotName(name) {
  const clean = String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 8);
  return clean || "NOVA";
}

function validEntry(entry) {
  return entry
    && Number.isFinite(Number(entry.score))
    && Number(entry.score) >= 0
    && typeof entry.name === "string";
}

export class LocalStore {
  getScores() {
    const scores = readJSON(SCORE_KEY, []);
    if (!Array.isArray(scores)) return [];

    return scores
      .filter(validEntry)
      .map((entry) => ({
        id: String(entry.id || ""),
        name: sanitizePilotName(entry.name),
        score: Math.floor(Number(entry.score)),
        gates: Math.max(0, Math.floor(Number(entry.gates) || 0)),
        perfects: Math.max(0, Math.floor(Number(entry.perfects) || 0)),
        date: Number(entry.date) || Date.now(),
      }))
      .sort((a, b) => b.score - a.score || a.date - b.date)
      .slice(0, MAX_SCORES);
  }

  getBest() {
    return this.getScores()[0]?.score || 0;
  }

  addScore({ name, score, gates = 0, perfects = 0 }) {
    const previousBest = this.getBest();
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const entry = {
      id,
      name: sanitizePilotName(name),
      score: Math.max(0, Math.floor(Number(score) || 0)),
      gates: Math.max(0, Math.floor(Number(gates) || 0)),
      perfects: Math.max(0, Math.floor(Number(perfects) || 0)),
      date: Date.now(),
    };

    const scores = [...this.getScores(), entry]
      .sort((a, b) => b.score - a.score || a.date - b.date)
      .slice(0, MAX_SCORES);

    writeJSON(SCORE_KEY, scores);

    return {
      id,
      scores,
      rank: scores.findIndex((item) => item.id === id) + 1,
      isNewRecord: entry.score > previousBest,
      best: scores[0]?.score || entry.score,
    };
  }

  getSettings() {
    const settings = readJSON(SETTINGS_KEY, {});
    return {
      sound: settings.sound !== false,
      pilot: sanitizePilotName(settings.pilot || "NOVA"),
      hasPlayed: settings.hasPlayed === true,
    };
  }

  updateSettings(patch) {
    const current = this.getSettings();
    const next = {
      ...current,
      ...patch,
      pilot: sanitizePilotName(patch.pilot ?? current.pilot),
    };
    writeJSON(SETTINGS_KEY, next);
    return next;
  }
}
