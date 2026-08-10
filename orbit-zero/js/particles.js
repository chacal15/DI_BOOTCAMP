import { TAU, random, pick } from "./utils.js";

/** Système de particules léger et plafonné pour rester fluide sur mobile. */
export class ParticleSystem {
  constructor(reducedMotion = false) {
    this.items = [];
    this.reducedMotion = reducedMotion;
    this.maxParticles = reducedMotion ? 110 : 460;
  }

  clear() {
    this.items.length = 0;
  }

  add(particle) {
    if (this.items.length >= this.maxParticles) {
      this.items.splice(0, Math.min(12, this.items.length));
    }

    this.items.push({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0.5,
      maxLife: particle.life ?? 0.5,
      size: 2,
      endSize: 0,
      color: "#ffffff",
      alpha: 1,
      drag: 2.5,
      gravity: 0,
      rotation: 0,
      spin: 0,
      shape: "circle",
      ...particle,
      maxLife: particle.life ?? particle.maxLife ?? 0.5,
    });
  }

  burst(x, y, options = {}) {
    const count = Math.ceil((options.count ?? 16) * (this.reducedMotion ? 0.4 : 1));
    const colors = options.colors || ["#58f5ff", "#ffffff"];
    const minSpeed = options.minSpeed ?? 35;
    const maxSpeed = options.maxSpeed ?? 180;

    for (let i = 0; i < count; i += 1) {
      const angle = options.angle ?? random(0, TAU);
      const spread = options.spread ?? TAU;
      const direction = angle + random(-spread / 2, spread / 2);
      const speed = random(minSpeed, maxSpeed);
      const life = random(options.minLife ?? 0.28, options.maxLife ?? 0.75);
      this.add({
        x: x + random(-2, 2),
        y: y + random(-2, 2),
        vx: Math.cos(direction) * speed + (options.baseVx || 0),
        vy: Math.sin(direction) * speed + (options.baseVy || 0),
        life,
        size: random(options.minSize ?? 1.4, options.maxSize ?? 4.2),
        endSize: options.endSize ?? 0,
        color: pick(colors),
        alpha: options.alpha ?? 1,
        drag: options.drag ?? 2.8,
        gravity: options.gravity ?? 0,
        rotation: random(0, TAU),
        spin: random(-8, 8),
        shape: options.shape || (Math.random() < 0.24 ? "diamond" : "circle"),
      });
    }
  }

  trail(x, y, color, vx = 0, vy = 0, scale = 1) {
    if (this.reducedMotion && Math.random() < 0.55) return;
    const life = random(0.22, 0.42);
    this.add({
      x: x + random(-2.5, 2.5),
      y: y + random(-2.5, 2.5),
      vx: vx + random(-14, 14),
      vy: vy + random(-14, 14),
      life,
      size: random(2.2, 5.4) * scale,
      endSize: 0,
      color,
      alpha: 0.72,
      drag: 5,
      shape: "circle",
    });
  }

  update(dt) {
    for (let i = this.items.length - 1; i >= 0; i -= 1) {
      const particle = this.items[i];
      particle.life -= dt;
      if (particle.life <= 0) {
        this.items.splice(i, 1);
        continue;
      }

      const damping = Math.exp(-particle.drag * dt);
      particle.vx *= damping;
      particle.vy = particle.vy * damping + particle.gravity * dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.rotation += particle.spin * dt;
    }
  }

  draw(ctx) {
    if (!this.items.length) return;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    for (const particle of this.items) {
      const progress = 1 - particle.life / particle.maxLife;
      const size = particle.size + (particle.endSize - particle.size) * progress;
      const alpha = Math.max(0, (1 - progress) * particle.alpha);
      if (size <= 0.05 || alpha <= 0.01) continue;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;

      if (particle.shape === "diamond") {
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.fillRect(-size * 0.55, -size * 0.55, size * 1.1, size * 1.1);
        ctx.restore();
      } else if (particle.shape === "spark") {
        const length = Math.max(size * 2, Math.hypot(particle.vx, particle.vy) * 0.035);
        const angle = Math.atan2(particle.vy, particle.vx);
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(angle);
        ctx.fillRect(-length, -size * 0.28, length, size * 0.56);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, TAU);
        ctx.fill();
      }
    }

    ctx.restore();
  }
}
