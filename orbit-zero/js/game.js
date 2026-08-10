import {
  TAU,
  angularDeltaPi,
  chance,
  clamp,
  damp,
  hexToRgba,
  lerp,
  pick,
  random,
  safeVibrate,
  wrapPi,
} from "./utils.js";
import { ParticleSystem } from "./particles.js";

const COLORS = {
  cyan: "#58f5ff",
  cyanSoft: "#b8fdff",
  violet: "#a970ff",
  pink: "#ff4fd8",
  gold: "#ffd66b",
  danger: "#ff426c",
  white: "#f7fdff",
};

const GATE_COLORS = [COLORS.cyan, COLORS.violet, COLORS.pink];
const NOOP = () => {};

/**
 * Cœur du jeu. Cette classe ne manipule pas l'interface HTML : elle communique
 * uniquement via des callbacks, ce qui garde le gameplay testable et isolé.
 */
export class OrbitGame {
  constructor(canvas, audio, callbacks = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    this.audio = audio;
    this.callbacks = {
      onStateChange: callbacks.onStateChange || NOOP,
      onHUD: callbacks.onHUD || NOOP,
      onCallout: callbacks.onCallout || NOOP,
      onFlash: callbacks.onFlash || NOOP,
      onGameOver: callbacks.onGameOver || NOOP,
    };

    this.reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false;
    this.particles = new ParticleSystem(this.reducedMotion);
    this.state = "menu";
    this.input = { left: false, right: false, pointerAxis: 0 };
    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.centerX = 0;
    this.centerY = 0;
    this.playerRadius = 80;
    this.outerRadius = 260;
    this.coreRadius = 20;
    this.orbRadius = 9;
    this.ringWidth = 10;
    this.stars = [];
    this.gates = [];
    this.ambientTime = 0;
    this.lastFrame = performance.now();
    this.shake = 0;
    this.hudTimer = 0;
    this.trailTimer = 0;
    this.levelNotice = 0;
    this.boundLoop = this.loop.bind(this);

    this.resetRun();
    this.resize();
    requestAnimationFrame(this.boundLoop);
  }

  resize() {
    const oldPlayerRadius = this.playerRadius;
    const oldOuterRadius = this.outerRadius;
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width || window.innerWidth));
    const height = Math.max(1, Math.round(rect.height || window.innerHeight));
    const dprCap = this.reducedMotion ? 1.5 : 2;
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);

    this.width = width;
    this.height = height;
    this.dpr = dpr;
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const minSide = Math.min(width, height);
    const portrait = height > width * 1.18;
    const shortLandscape = height < 520 && width > height;
    this.centerX = width * 0.5;
    this.centerY = height * (portrait ? 0.435 : shortLandscape ? 0.51 : 0.52);
    this.playerRadius = clamp(minSide * 0.15, shortLandscape ? 54 : 58, 116);
    this.outerRadius = Math.max(
      this.playerRadius + 92,
      Math.min(minSide * 0.465, this.playerRadius + 265),
    );
    this.coreRadius = clamp(this.playerRadius * 0.235, 14, 27);
    this.orbRadius = clamp(this.playerRadius * 0.092, 7, 11.5);
    this.ringWidth = clamp(minSide * 0.017, 7.5, 14);

    // Préserve la progression radiale des anneaux pendant un changement d'orientation.
    if (oldOuterRadius > oldPlayerRadius && this.gates.length) {
      for (const gate of this.gates) {
        const progress = (oldOuterRadius - gate.radius) / (oldOuterRadius - oldPlayerRadius);
        gate.radius = this.outerRadius - progress * (this.outerRadius - this.playerRadius);
      }
    }

    this.particles.clear();
    this.createStars();
  }

  createStars() {
    const count = Math.round(clamp((this.width * this.height) / 10500, 48, this.reducedMotion ? 70 : 120));
    this.stars = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: random(0.45, 1.65),
      alpha: random(0.16, 0.72),
      phase: random(0, TAU),
      speed: random(0.25, 1.2),
      drift: random(-1, 1),
    }));
  }

  resetRun() {
    this.score = 0;
    this.elapsed = 0;
    this.gatesPassed = 0;
    this.perfects = 0;
    this.shards = 0;
    this.rescues = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.multiplier = 1;
    this.lastMultiplier = 1;
    this.energy = 100;
    this.phaseTime = 0;
    this.phaseCooldown = 0;
    this.playerAngle = -Math.PI / 2;
    this.playerVelocity = 0;
    this.playerAlive = true;
    this.spawnTimer = 0;
    this.lastTargetAngle = wrapPi(this.playerAngle);
    this.endDelay = 0;
    this.gates = [];
    this.particles.clear();
    this.shake = 0;
    this.hudTimer = 0;
    this.trailTimer = 0;
    this.levelNotice = 0;
    this.tutorialPulseShown = false;
    this.resetInput();
  }

  start() {
    this.resetRun();
    this.setState("playing");
    this.spawnGate(true);
    this.spawnTimer = 1.18;
    this.audio.start();
    this.callbacks.onHUD(this.getHUDData());
    this.callbacks.onCallout("ALIGNE LES ORBES", "normal");
  }

  showMenu() {
    this.resetInput();
    this.gates.length = 0;
    this.particles.clear();
    this.setState("menu");
  }

  pause() {
    if (this.state !== "playing") return;
    this.resetInput();
    this.setState("paused");
  }

  resume() {
    if (this.state !== "paused") return;
    this.lastFrame = performance.now();
    this.setState("playing");
  }

  togglePause() {
    if (this.state === "playing") this.pause();
    else if (this.state === "paused") this.resume();
  }

  setState(state) {
    this.state = state;
    this.callbacks.onStateChange(state);
  }

  setInput(direction, active) {
    if (direction === "left" || direction === "right") {
      this.input[direction] = Boolean(active);
    }
  }

  setPointerAxis(axis) {
    this.input.pointerAxis = clamp(Number(axis) || 0, -1, 1);
  }

  nudgeAngle(delta) {
    if (this.state !== "playing") return;
    this.playerAngle += clamp(delta, -0.35, 0.35);
  }

  resetInput() {
    this.input.left = false;
    this.input.right = false;
    this.input.pointerAxis = 0;
  }

  getDifficulty() {
    return clamp(this.elapsed / 82 + this.gatesPassed / 180, 0, 1);
  }

  getMultiplier() {
    return clamp(1 + Math.floor(this.combo / 3), 1, 8);
  }

  getSpawnInterval() {
    const difficulty = this.getDifficulty();
    return lerp(1.4, 0.72, difficulty) * random(0.94, 1.06);
  }

  getRingSpeed() {
    const travelTime = lerp(2.55, 1.42, this.getDifficulty());
    return (this.outerRadius - this.playerRadius) / travelTime;
  }

  spawnGate(first = false) {
    const difficulty = this.getDifficulty();
    const interval = first ? 1.25 : this.getSpawnInterval();
    const maxPlayerSpeed = lerp(3.0, 3.72, difficulty);
    let targetAngle = this.lastTargetAngle;

    if (!first) {
      const movementBudget = Math.min(1.34, maxPlayerSpeed * interval * 0.57);
      const smallShift = chance(0.16);
      const magnitude = smallShift
        ? random(0.1, 0.34)
        : random(Math.min(0.34, movementBudget * 0.42), Math.max(0.42, movementBudget));
      targetAngle = wrapPi(this.lastTargetAngle + magnitude * (chance(0.5) ? -1 : 1));
    }

    const rotating = !first && difficulty > 0.12 && chance(lerp(0.08, 0.48, difficulty));
    const rotationSpeed = rotating
      ? random(lerp(0.13, 0.24, difficulty), lerp(0.27, 0.58, difficulty)) * (chance(0.5) ? -1 : 1)
      : 0;
    const radius = first
      ? this.playerRadius + (this.outerRadius - this.playerRadius) * 0.72
      : this.outerRadius;
    const estimatedArrival = (radius - this.playerRadius) / Math.max(1, this.getRingSpeed());
    const gapHalf = clamp(lerp(0.77, 0.55, difficulty) + random(-0.035, 0.045), 0.51, 0.82);

    const gate = {
      id: `${this.elapsed.toFixed(3)}-${Math.random().toString(36).slice(2, 6)}`,
      radius,
      previousRadius: radius,
      angle: targetAngle - rotationSpeed * estimatedArrival,
      targetAngle,
      gapHalf,
      rotationSpeed,
      rotating,
      color: rotating ? COLORS.violet : pick(GATE_COLORS),
      accent: chance(0.14 + difficulty * 0.18) ? COLORS.gold : COLORS.cyanSoft,
      hasShard: !first && chance(lerp(0.28, 0.45, difficulty)),
      age: 0,
      crossed: false,
      dead: false,
      pulseOffset: random(0, TAU),
    };

    this.gates.push(gate);
    this.lastTargetAngle = targetAngle;
    if (!first) this.spawnTimer = interval;
  }

  activatePulse() {
    if (this.state !== "playing") return false;
    const cost = 36;
    if (this.energy < cost || this.phaseCooldown > 0) {
      this.audio.denied();
      return false;
    }

    this.energy = Math.max(0, this.energy - cost);
    this.phaseTime = 0.48;
    this.phaseCooldown = 0.66;
    this.shake = Math.max(this.shake, 4.5);
    this.emitPulseBurst();
    this.audio.pulse();
    safeVibrate(18);
    this.callbacks.onFlash("pulse");
    this.callbacks.onHUD(this.getHUDData());
    return true;
  }

  updatePlaying(dt) {
    this.elapsed += dt;
    const difficulty = this.getDifficulty();
    const scoreRate = lerp(14, 30, difficulty) * (1 + (this.multiplier - 1) * 0.08);
    this.score += scoreRate * dt;
    this.energy = Math.min(100, this.energy + lerp(2.8, 3.8, difficulty) * dt);
    this.phaseTime = Math.max(0, this.phaseTime - dt);
    this.phaseCooldown = Math.max(0, this.phaseCooldown - dt);

    this.updatePlayer(dt);

    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) this.spawnGate(false);

    const ringSpeed = this.getRingSpeed();
    for (let index = this.gates.length - 1; index >= 0; index -= 1) {
      const gate = this.gates[index];
      gate.age += dt;
      gate.previousRadius = gate.radius;
      gate.radius -= ringSpeed * dt;
      gate.angle += gate.rotationSpeed * dt;

      if (!gate.crossed && gate.previousRadius > this.playerRadius && gate.radius <= this.playerRadius) {
        gate.crossed = true;
        this.resolveGate(gate);
      }

      if (gate.dead || gate.radius < this.coreRadius * 0.55) {
        this.gates.splice(index, 1);
      }

      if (this.state !== "playing") break;
    }

    this.emitPlayerTrail(dt);

    if (!this.tutorialPulseShown && this.elapsed > 4.4) {
      this.tutorialPulseShown = true;
      this.callbacks.onCallout("PULSE = TRAVERSER", "normal");
    }

    const level = Math.floor(this.elapsed / 20);
    if (level > this.levelNotice) {
      this.levelNotice = level;
      this.callbacks.onCallout("VITESSE +", "normal");
    }

    this.hudTimer -= dt;
    if (this.hudTimer <= 0) {
      this.hudTimer = 0.05;
      this.callbacks.onHUD(this.getHUDData());
    }
  }

  updatePlayer(dt) {
    const keyboardAxis = (this.input.right ? 1 : 0) - (this.input.left ? 1 : 0);
    const axis = clamp(keyboardAxis + this.input.pointerAxis, -1, 1);
    const maxSpeed = lerp(3.02, 3.72, this.getDifficulty());
    const targetVelocity = axis * maxSpeed;
    const responsiveness = axis === 0 ? 9.5 : (Math.sign(targetVelocity) !== Math.sign(this.playerVelocity) ? 19 : 14);

    this.playerVelocity = damp(this.playerVelocity, targetVelocity, responsiveness, dt);
    if (Math.abs(this.playerVelocity) < 0.004) this.playerVelocity = 0;
    this.playerAngle += this.playerVelocity * dt;

    if (Math.abs(this.playerAngle) > TAU * 100) {
      this.playerAngle %= TAU;
    }
  }

  getGateClearance(gate) {
    const physicalPadding = (this.orbRadius + this.ringWidth * 0.56 + 2.5) / this.playerRadius;
    return Math.max(0.14, gate.gapHalf - physicalPadding);
  }

  resolveGate(gate) {
    const error = Math.abs(angularDeltaPi(this.playerAngle, gate.angle));
    const clearance = this.getGateClearance(gate);

    if (this.phaseTime > 0) {
      this.gatesPassed += 1;
      this.rescues += 1;
      this.combo = Math.max(0, this.combo - 1);
      this.multiplier = this.getMultiplier();
      this.score += Math.round(55 * this.multiplier);
      this.emitGateBreak(gate, "pulse");
      gate.dead = true;
      this.shake = Math.max(this.shake, 5.5);
      this.callbacks.onCallout("TRAVERSÉ", "normal");
      this.callbacks.onHUD(this.getHUDData());
      return;
    }

    if (error <= clearance) {
      const perfectLimit = Math.max(0.075, Math.min(0.12, clearance * 0.33));
      const perfect = error <= perfectLimit;
      const collectedShard = gate.hasShard && error <= clearance * 0.58;

      this.gatesPassed += 1;
      this.combo += perfect ? 2 : 1;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
      this.multiplier = this.getMultiplier();
      const baseScore = Math.round(lerp(95, 160, this.getDifficulty()));
      this.score += Math.round(baseScore * this.multiplier * (perfect ? 1.85 : 1));
      this.energy = Math.min(100, this.energy + (perfect ? 18 : 5));

      if (perfect) this.perfects += 1;
      if (collectedShard) {
        this.shards += 1;
        this.energy = Math.min(100, this.energy + 8);
        this.score += 70 * this.multiplier;
      }

      this.emitGateBreak(gate, perfect ? "perfect" : "safe");
      gate.dead = true;
      this.shake = Math.max(this.shake, perfect ? 3.7 : 1.7);

      if (perfect) {
        this.audio.perfect(this.combo);
        this.callbacks.onCallout(collectedShard ? "PARFAIT · ÉNERGIE +" : "PARFAIT", "perfect");
        this.callbacks.onFlash("perfect");
        safeVibrate(10);
      } else {
        this.audio.pass(this.combo);
      }

      if (this.multiplier > this.lastMultiplier) {
        this.lastMultiplier = this.multiplier;
        this.callbacks.onCallout(`FLUX ×${this.multiplier}`, "perfect");
      }

      this.callbacks.onHUD(this.getHUDData());
      return;
    }

    this.crash(gate);
  }

  crash(gate) {
    if (this.state !== "playing") return;
    gate.color = COLORS.danger;
    this.playerAlive = false;
    this.endDelay = 0.72;
    this.resetInput();
    this.setState("dying");
    this.shake = this.reducedMotion ? 2 : 17;
    this.emitCrashBurst();
    this.audio.hit();
    safeVibrate([35, 35, 85]);
    this.callbacks.onFlash("danger");
  }

  updateDying(dt) {
    this.endDelay -= dt;
    this.phaseTime = Math.max(0, this.phaseTime - dt);

    for (const gate of this.gates) {
      gate.radius -= this.getRingSpeed() * dt * 0.2;
      gate.angle += gate.rotationSpeed * dt * 0.3;
    }

    if (this.endDelay <= 0) this.finishGame();
  }

  finishGame() {
    if (this.state !== "dying") return;
    this.setState("gameover");
    this.callbacks.onGameOver(this.getFinalStats());
  }

  getHUDData() {
    return {
      score: Math.floor(this.score),
      combo: this.combo,
      multiplier: this.multiplier,
      energy: this.energy,
      pulseReady: this.energy >= 36 && this.phaseCooldown <= 0,
      gates: this.gatesPassed,
      perfects: this.perfects,
    };
  }

  getFinalStats() {
    return {
      score: Math.floor(this.score),
      gates: this.gatesPassed,
      perfects: this.perfects,
      maxCombo: this.maxCombo,
      maxMultiplier: clamp(1 + Math.floor(this.maxCombo / 3), 1, 8),
      shards: this.shards,
      rescues: this.rescues,
      duration: this.elapsed,
    };
  }

  emitPlayerTrail(dt) {
    this.trailTimer -= dt;
    if (this.trailTimer > 0) return;
    this.trailTimer = this.phaseTime > 0 ? 0.012 : 0.027;

    for (let side = 0; side < 2; side += 1) {
      const angle = this.playerAngle + side * Math.PI;
      const x = this.centerX + Math.cos(angle) * this.playerRadius;
      const y = this.centerY + Math.sin(angle) * this.playerRadius;
      const tangentX = -Math.sin(angle) * this.playerVelocity * this.playerRadius * -0.12;
      const tangentY = Math.cos(angle) * this.playerVelocity * this.playerRadius * -0.12;
      this.particles.trail(
        x,
        y,
        side === 0 ? COLORS.cyan : COLORS.violet,
        tangentX,
        tangentY,
        this.phaseTime > 0 ? 1.45 : 1,
      );
    }
  }

  emitGateBreak(gate, mode) {
    const colors = mode === "perfect"
      ? [COLORS.gold, COLORS.white, gate.color]
      : mode === "pulse"
        ? [COLORS.cyan, COLORS.violet, COLORS.white]
        : [gate.color, COLORS.cyanSoft];
    const count = mode === "perfect" ? 44 : mode === "pulse" ? 38 : 26;
    const actualCount = Math.ceil(count * (this.reducedMotion ? 0.42 : 1));

    for (let i = 0; i < actualCount; i += 1) {
      let angle = random(0, TAU);
      // Les fragments viennent surtout des parties solides de l'anneau.
      for (let tries = 0; tries < 4 && Math.abs(angularDeltaPi(angle, gate.angle)) < gate.gapHalf; tries += 1) {
        angle = random(0, TAU);
      }
      const radius = this.playerRadius + random(-this.ringWidth * 0.5, this.ringWidth * 0.5);
      const radialSpeed = random(25, mode === "perfect" ? 175 : 120) * (chance(0.72) ? 1 : -0.4);
      const tangentSpeed = random(-70, 70);
      this.particles.add({
        x: this.centerX + Math.cos(angle) * radius,
        y: this.centerY + Math.sin(angle) * radius,
        vx: Math.cos(angle) * radialSpeed - Math.sin(angle) * tangentSpeed,
        vy: Math.sin(angle) * radialSpeed + Math.cos(angle) * tangentSpeed,
        life: random(0.35, mode === "perfect" ? 0.95 : 0.7),
        size: random(1.3, mode === "perfect" ? 5.2 : 3.9),
        endSize: 0,
        color: pick(colors),
        alpha: random(0.62, 1),
        drag: random(1.4, 3.2),
        rotation: angle,
        spin: random(-7, 7),
        shape: chance(0.48) ? "spark" : "diamond",
      });
    }

    for (let side = 0; side < 2; side += 1) {
      const angle = this.playerAngle + side * Math.PI;
      const x = this.centerX + Math.cos(angle) * this.playerRadius;
      const y = this.centerY + Math.sin(angle) * this.playerRadius;
      this.particles.burst(x, y, {
        count: mode === "perfect" ? 13 : 8,
        colors,
        minSpeed: 25,
        maxSpeed: 145,
        minLife: 0.25,
        maxLife: 0.65,
        minSize: 1.5,
        maxSize: 4.5,
      });
    }
  }

  emitPulseBurst() {
    const count = this.reducedMotion ? 18 : 44;
    for (let i = 0; i < count; i += 1) {
      const angle = random(0, TAU);
      const radius = random(this.playerRadius * 0.75, this.playerRadius * 1.08);
      const speed = random(45, 180);
      this.particles.add({
        x: this.centerX + Math.cos(angle) * radius,
        y: this.centerY + Math.sin(angle) * radius,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: random(0.3, 0.72),
        size: random(1.5, 4.5),
        endSize: 0,
        color: chance(0.5) ? COLORS.cyan : COLORS.violet,
        alpha: 0.9,
        drag: 2.4,
        shape: chance(0.5) ? "spark" : "circle",
      });
    }
  }

  emitCrashBurst() {
    for (let side = 0; side < 2; side += 1) {
      const angle = this.playerAngle + side * Math.PI;
      const x = this.centerX + Math.cos(angle) * this.playerRadius;
      const y = this.centerY + Math.sin(angle) * this.playerRadius;
      this.particles.burst(x, y, {
        count: 42,
        colors: [COLORS.danger, COLORS.pink, COLORS.white, side ? COLORS.violet : COLORS.cyan],
        minSpeed: 55,
        maxSpeed: 320,
        minLife: 0.35,
        maxLife: 1.15,
        minSize: 1.8,
        maxSize: 6.8,
        drag: 1.9,
        shape: "spark",
      });
    }
  }

  loop(timestamp) {
    const rawDt = (timestamp - this.lastFrame) / 1000;
    const dt = clamp(Number.isFinite(rawDt) ? rawDt : 0, 0, 0.034);
    this.lastFrame = timestamp;
    this.ambientTime += dt;

    if (this.state === "playing") {
      this.updatePlaying(dt);
      this.particles.update(dt);
    } else if (this.state === "dying") {
      this.updateDying(dt);
      this.particles.update(dt);
    } else if (this.state !== "paused") {
      this.particles.update(dt * 0.65);
    }

    if (this.state !== "paused") {
      this.shake = damp(this.shake, 0, 12, dt);
    }

    this.draw();
    requestAnimationFrame(this.boundLoop);
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.save();

    if (this.shake > 0.08 && !this.reducedMotion) {
      const amplitude = this.shake;
      ctx.translate(random(-amplitude, amplitude), random(-amplitude, amplitude));
    }

    this.drawBackground(ctx);

    if (this.state === "menu") {
      this.drawIdleScene(ctx);
    } else {
      this.drawArenaGuides(ctx);
      for (const gate of this.gates) this.drawGate(ctx, gate);
      this.drawCore(ctx, this.phaseTime > 0 ? 1 : 0);
      if (this.playerAlive) this.drawPlayer(ctx);
      this.particles.draw(ctx);
    }

    ctx.restore();
  }

  drawBackground(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(5, 8, 18, 0.34)";
    ctx.fillRect(-20, -20, this.width + 40, this.height + 40);

    for (const star of this.stars) {
      const twinkle = 0.58 + Math.sin(this.ambientTime * star.speed + star.phase) * 0.42;
      const x = star.x * this.width + Math.sin(this.ambientTime * 0.08 + star.phase) * star.drift * 6;
      const y = star.y * this.height;
      ctx.globalAlpha = star.alpha * twinkle;
      ctx.fillStyle = star.size > 1.25 ? COLORS.cyanSoft : "#a9bed4";
      ctx.beginPath();
      ctx.arc(x, y, star.size, 0, TAU);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.restore();
  }

  drawArenaGuides(ctx) {
    ctx.save();
    ctx.translate(this.centerX, this.centerY);

    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, this.outerRadius * 1.05);
    glow.addColorStop(0, "rgba(61, 119, 168, 0.07)");
    glow.addColorStop(0.5, "rgba(53, 95, 143, 0.025)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, this.outerRadius * 1.05, 0, TAU);
    ctx.fill();

    ctx.lineWidth = 1;
    for (let index = 1; index <= 4; index += 1) {
      const radius = this.playerRadius + (this.outerRadius - this.playerRadius) * (index / 4);
      ctx.strokeStyle = `rgba(125, 203, 235, ${0.025 + index * 0.009})`;
      ctx.setLineDash(index % 2 ? [2, 9] : [1, 13]);
      ctx.lineDashOffset = this.ambientTime * (index % 2 ? 3 : -2);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, TAU);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(88, 245, 255, 0.11)";
    ctx.beginPath();
    ctx.arc(0, 0, this.playerRadius, 0, TAU);
    ctx.stroke();

    const tickCount = 24;
    ctx.rotate(this.ambientTime * 0.025);
    for (let index = 0; index < tickCount; index += 1) {
      const angle = (index / tickCount) * TAU;
      const inner = this.outerRadius + (index % 3 === 0 ? 6 : 9);
      const outer = inner + (index % 3 === 0 ? 7 : 3);
      ctx.strokeStyle = index % 3 === 0 ? "rgba(88, 245, 255, 0.13)" : "rgba(180, 216, 232, 0.06)";
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
      ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawGate(ctx, gate) {
    if (gate.radius <= 1) return;
    const fadeIn = clamp((this.outerRadius - gate.radius + 18) / 38, 0.08, 1);
    const proximity = 1 - clamp(Math.abs(gate.radius - this.playerRadius) / (this.playerRadius * 0.72), 0, 1);
    const pulse = 0.75 + Math.sin(this.ambientTime * 4.2 + gate.pulseOffset) * 0.25;
    const lineWidth = this.ringWidth * (1 + proximity * 0.08);
    const gapHalf = gate.gapHalf;

    ctx.save();
    ctx.translate(this.centerX, this.centerY);
    ctx.globalAlpha = fadeIn;
    ctx.lineCap = "round";

    // Halo sous l'anneau.
    ctx.strokeStyle = hexToRgba(gate.color, 0.11 + proximity * 0.12);
    ctx.lineWidth = lineWidth * 2.8;
    ctx.shadowColor = gate.color;
    ctx.shadowBlur = this.reducedMotion ? 0 : 16 + proximity * 12;
    this.strokeGateArcs(ctx, gate.radius, gate.angle, gapHalf);

    // Corps principal.
    ctx.strokeStyle = hexToRgba(gate.color, 0.65 + proximity * 0.28);
    ctx.lineWidth = lineWidth;
    ctx.shadowBlur = this.reducedMotion ? 0 : 8 + proximity * 11;
    this.strokeGateArcs(ctx, gate.radius, gate.angle, gapHalf);

    // Fil blanc dynamique qui améliore la lisibilité à haute vitesse.
    ctx.strokeStyle = `rgba(237, 252, 255, ${0.16 + proximity * 0.24})`;
    ctx.lineWidth = Math.max(1, lineWidth * 0.16);
    ctx.shadowBlur = 0;
    this.strokeGateArcs(ctx, gate.radius - lineWidth * 0.12, gate.angle, gapHalf);

    if (gate.rotating) {
      ctx.strokeStyle = hexToRgba(gate.accent, 0.28 * pulse);
      ctx.lineWidth = 1.25;
      ctx.setLineDash([4, 8]);
      ctx.lineDashOffset = -this.ambientTime * 18 * Math.sign(gate.rotationSpeed);
      ctx.beginPath();
      ctx.arc(0, 0, gate.radius + lineWidth * 1.15, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    this.drawGapEdges(ctx, gate, lineWidth, proximity);
    if (gate.hasShard) this.drawGateShards(ctx, gate, pulse);

    ctx.restore();
  }

  strokeGateArcs(ctx, radius, angle, halfGap) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, angle + halfGap, angle + Math.PI - halfGap);
    ctx.arc(0, 0, radius, angle + Math.PI + halfGap, angle + TAU - halfGap);
    ctx.stroke();
  }

  drawGapEdges(ctx, gate, lineWidth, proximity) {
    const edgeAngles = [
      gate.angle - gate.gapHalf,
      gate.angle + gate.gapHalf,
      gate.angle + Math.PI - gate.gapHalf,
      gate.angle + Math.PI + gate.gapHalf,
    ];

    ctx.strokeStyle = hexToRgba(gate.accent, 0.36 + proximity * 0.35);
    ctx.lineWidth = Math.max(1, lineWidth * 0.18);
    ctx.shadowColor = gate.accent;
    ctx.shadowBlur = this.reducedMotion ? 0 : 8;

    for (const angle of edgeAngles) {
      const inner = gate.radius - lineWidth * 1.3;
      const outer = gate.radius + lineWidth * 1.3;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
      ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
      ctx.stroke();
    }
  }

  drawGateShards(ctx, gate, pulse) {
    for (let side = 0; side < 2; side += 1) {
      const angle = gate.angle + side * Math.PI;
      const x = Math.cos(angle) * gate.radius;
      const y = Math.sin(angle) * gate.radius;
      const size = clamp(this.ringWidth * 0.5, 4, 7) * (0.9 + pulse * 0.12);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(this.ambientTime * 2.5 + side * Math.PI / 2);
      ctx.fillStyle = COLORS.gold;
      ctx.shadowColor = COLORS.gold;
      ctx.shadowBlur = this.reducedMotion ? 0 : 14;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.62, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.62, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  drawCore(ctx, phase = 0) {
    const pulse = 1 + Math.sin(this.ambientTime * 3.2) * 0.04;
    const radius = this.coreRadius * pulse;

    ctx.save();
    ctx.translate(this.centerX, this.centerY);
    ctx.globalCompositeOperation = "lighter";

    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 3.2);
    glow.addColorStop(0, phase ? "rgba(88,245,255,0.55)" : "rgba(171,132,255,0.34)");
    glow.addColorStop(0.34, phase ? "rgba(88,245,255,0.16)" : "rgba(88,245,255,0.11)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 3.2, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = phase ? "rgba(88,245,255,0.66)" : "rgba(154,205,255,0.28)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.lineDashOffset = -this.ambientTime * 8;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 1.55, 0, TAU);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.rotate(this.ambientTime * 0.58);
    ctx.fillStyle = phase ? COLORS.cyan : "#b9b1ff";
    ctx.shadowColor = phase ? COLORS.cyan : COLORS.violet;
    ctx.shadowBlur = this.reducedMotion ? 0 : 16;
    ctx.beginPath();
    for (let side = 0; side < 6; side += 1) {
      const angle = side / 6 * TAU - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (side === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.28, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  drawPlayer(ctx) {
    const phaseStrength = this.phaseTime > 0 ? clamp(this.phaseTime / 0.48, 0, 1) : 0;
    const trailLength = clamp(Math.abs(this.playerVelocity) * 0.13 + 0.2, 0.2, 0.62);
    const direction = Math.sign(this.playerVelocity || 1);

    ctx.save();
    ctx.translate(this.centerX, this.centerY);

    // Tethers et rail orbital.
    ctx.strokeStyle = phaseStrength
      ? `rgba(88,245,255,${0.22 + phaseStrength * 0.2})`
      : "rgba(137, 210, 238, 0.08)";
    ctx.lineWidth = phaseStrength ? 1.5 : 1;
    ctx.setLineDash([3, 7]);
    ctx.lineDashOffset = -this.ambientTime * 10;
    ctx.beginPath();
    ctx.moveTo(Math.cos(this.playerAngle) * this.coreRadius * 1.2, Math.sin(this.playerAngle) * this.coreRadius * 1.2);
    ctx.lineTo(Math.cos(this.playerAngle) * (this.playerRadius - this.orbRadius * 1.8), Math.sin(this.playerAngle) * (this.playerRadius - this.orbRadius * 1.8));
    ctx.moveTo(Math.cos(this.playerAngle + Math.PI) * this.coreRadius * 1.2, Math.sin(this.playerAngle + Math.PI) * this.coreRadius * 1.2);
    ctx.lineTo(Math.cos(this.playerAngle + Math.PI) * (this.playerRadius - this.orbRadius * 1.8), Math.sin(this.playerAngle + Math.PI) * (this.playerRadius - this.orbRadius * 1.8));
    ctx.stroke();
    ctx.setLineDash([]);

    if (phaseStrength) {
      ctx.strokeStyle = `rgba(88,245,255,${phaseStrength * 0.42})`;
      ctx.lineWidth = 2 + phaseStrength * 4;
      ctx.shadowColor = COLORS.cyan;
      ctx.shadowBlur = this.reducedMotion ? 0 : 18;
      ctx.beginPath();
      ctx.arc(0, 0, this.playerRadius, 0, TAU);
      ctx.stroke();
    }

    // Deux arcs de traînée opposés.
    const playerColors = [COLORS.cyan, COLORS.violet];
    for (let side = 0; side < 2; side += 1) {
      const angle = this.playerAngle + side * Math.PI;
      ctx.strokeStyle = hexToRgba(playerColors[side], 0.32 + phaseStrength * 0.3);
      ctx.lineWidth = this.orbRadius * (0.45 + phaseStrength * 0.3);
      ctx.lineCap = "round";
      ctx.shadowColor = playerColors[side];
      ctx.shadowBlur = this.reducedMotion ? 0 : 10;
      ctx.beginPath();
      if (direction >= 0) ctx.arc(0, 0, this.playerRadius, angle - trailLength, angle);
      else ctx.arc(0, 0, this.playerRadius, angle, angle + trailLength);
      ctx.stroke();
    }

    // Fantômes d'impulsion.
    if (phaseStrength && !this.reducedMotion) {
      for (let ghost = 1; ghost <= 3; ghost += 1) {
        ctx.globalAlpha = phaseStrength * (0.18 / ghost);
        for (let side = 0; side < 2; side += 1) {
          const angle = this.playerAngle + side * Math.PI - direction * ghost * 0.055;
          this.drawOrb(ctx, angle, playerColors[side], 1 + ghost * 0.12, false);
        }
      }
    }

    ctx.globalAlpha = 1;
    for (let side = 0; side < 2; side += 1) {
      this.drawOrb(ctx, this.playerAngle + side * Math.PI, playerColors[side], 1 + phaseStrength * 0.25, true);
    }

    ctx.restore();
  }

  drawOrb(ctx, angle, color, scale = 1, detailed = true) {
    const x = Math.cos(angle) * this.playerRadius;
    const y = Math.sin(angle) * this.playerRadius;
    const radius = this.orbRadius * scale;

    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = hexToRgba(color, detailed ? 0.28 : 0.45);
    ctx.shadowColor = color;
    ctx.shadowBlur = this.reducedMotion ? 0 : radius * 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 1.72, 0, TAU);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, TAU);
    ctx.fill();

    if (detailed) {
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = this.reducedMotion ? 0 : 9;
      ctx.beginPath();
      ctx.arc(-radius * 0.18, -radius * 0.2, radius * 0.38, 0, TAU);
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.48)";
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.28, 0, TAU);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawIdleScene(ctx) {
    this.drawArenaGuides(ctx);
    const base = this.playerRadius * 1.18;
    const spread = (this.outerRadius - base) / 3;

    for (let index = 0; index < 3; index += 1) {
      const radius = base + spread * (index + 0.45 + Math.sin(this.ambientTime * 0.24 + index) * 0.1);
      const angle = this.ambientTime * (index % 2 ? -0.12 : 0.09) + index * 0.82;
      const gate = {
        radius,
        angle,
        gapHalf: 0.67,
        color: GATE_COLORS[index],
        accent: index === 2 ? COLORS.gold : COLORS.cyanSoft,
        rotating: index === 1,
        rotationSpeed: index === 1 ? -0.2 : 0,
        hasShard: index === 2,
        pulseOffset: index,
      };
      ctx.save();
      ctx.globalAlpha = 0.36;
      this.drawGate(ctx, gate);
      ctx.restore();
    }

    this.drawCore(ctx, 0);
    const previousAngle = this.playerAngle;
    this.playerAngle = this.ambientTime * 0.34 - Math.PI / 2;
    this.playerVelocity = 0.8;
    this.drawPlayer(ctx);
    this.playerAngle = previousAngle;
    this.playerVelocity = 0;
    this.particles.draw(ctx);
  }
}
