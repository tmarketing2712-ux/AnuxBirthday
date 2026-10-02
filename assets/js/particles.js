/**
 * ✨ PARTICLES & CELESTIAL BACKGROUND ENGINE
 * Creates subtle glowing particles, tiny stars, floating petals/hearts,
 * and delicate stardust trails without distracting from the content.
 */

class SurpriseParticlesEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    
    this.particles = [];
    this.burstParticles = [];
    this.mouse = { x: -100, y: -100, isMoving: false };
    this.mouseTimer = null;
    
    this.maxParticles = window.innerWidth < 768 ? 45 : 85;
    this.animationFrameId = null;

    this.resizeCanvas();
    this.initParticles();
    this.bindEvents();
    this.startLoop();
  }

  resizeCanvas() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle(x, y, isTemporary = false) {
    const types = ["star", "glow", "dust", "petal"];
    const type = types[Math.floor(Math.random() * types.length)];
    
    return {
      x: x !== undefined ? x : Math.random() * this.width,
      y: y !== undefined ? y : Math.random() * this.height,
      radius: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.6 - 0.1, // Gently floats upward
      opacity: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      type: type,
      color: this.getRandomColor(),
      life: isTemporary ? 1.0 : null,
      decay: Math.random() * 0.015 + 0.01
    };
  }

  getRandomColor() {
    const colors = [
      "rgba(255, 224, 178, ",  // Warm champagne gold
      "rgba(255, 235, 238, ",  // Soft blush pink
      "rgba(243, 229, 245, ",  // Soft lavender
      "rgba(255, 255, 255, ",  // Pure starlight white
      "rgba(230, 202, 133, "   // Subtle antique gold
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.resizeCanvas();
      this.maxParticles = window.innerWidth < 768 ? 45 : 85;
    });

    const updateCoords = (x, y) => {
      this.mouse.x = x;
      this.mouse.y = y;
      this.mouse.isMoving = true;

      // Add a couple of stardust trail particles
      if (Math.random() < 0.4) {
        this.burstParticles.push(this.createParticle(x, y, true));
      }

      clearTimeout(this.mouseTimer);
      this.mouseTimer = setTimeout(() => {
        this.mouse.isMoving = false;
      }, 300);
    };

    window.addEventListener("mousemove", (e) => updateCoords(e.clientX, e.clientY));
    window.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        updateCoords(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  // Trigger celebration particle bloom
  burst(x, y, count = 35) {
    const originX = x || this.width / 2;
    const originY = y || this.height / 2;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      this.burstParticles.push({
        x: originX,
        y: originY,
        radius: Math.random() * 3 + 1,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        opacity: 1,
        color: this.getRandomColor(),
        life: 1.0,
        decay: Math.random() * 0.02 + 0.015,
        type: Math.random() < 0.3 ? "heart" : "star"
      });
    }
  }

  startLoop() {
    const loop = () => {
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Render & update ambient particles
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.y += p.speedY;
        p.x += p.speedX;

        // Twinkle pulse
        p.opacity += Math.sin(Date.now() * p.pulseSpeed * 0.05) * 0.01;
        p.opacity = Math.max(0.1, Math.min(0.85, p.opacity));

        // Wrap around boundaries
        if (p.y < -10) {
          p.y = this.height + 10;
          p.x = Math.random() * this.width;
        }
        if (p.x < -10) p.x = this.width + 10;
        if (p.x > this.width + 10) p.x = -10;

        this.drawParticle(p);
      }

      // Render & update burst/trail particles
      for (let i = this.burstParticles.length - 1; i >= 0; i--) {
        const bp = this.burstParticles[i];
        bp.x += bp.speedX;
        bp.y += bp.speedY;
        bp.speedY += 0.04; // Gentle gravity
        bp.life -= bp.decay;
        bp.opacity = Math.max(0, bp.life);

        if (bp.life <= 0) {
          this.burstParticles.splice(i, 1);
        } else {
          this.drawParticle(bp);
        }
      }

      this.animationFrameId = requestAnimationFrame(loop);
    };

    loop();
  }

  drawParticle(p) {
    this.ctx.save();
    this.ctx.fillStyle = p.color + p.opacity + ")";

    if (p.type === "star") {
      // Draw tiny 4-pointed star
      const r = p.radius * 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y - r);
      this.ctx.quadraticCurveTo(p.x, p.y, p.x + r, p.y);
      this.ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + r);
      this.ctx.quadraticCurveTo(p.x, p.y, p.x - r, p.y);
      this.ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - r);
      this.ctx.closePath();
      this.ctx.fill();
    } else if (p.type === "heart" && p.life !== null) {
      // Subtle floating heart in burst
      const size = p.radius * 2;
      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y);
      this.ctx.bezierCurveTo(p.x - size / 2, p.y - size / 2, p.x - size, p.y + size / 3, p.x, p.y + size);
      this.ctx.bezierCurveTo(p.x + size, p.y + size / 3, p.x + size / 2, p.y - size / 2, p.x, p.y);
      this.ctx.fill();
    } else {
      // Soft glow orb / dust
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }
}

window.SurpriseParticlesEngine = SurpriseParticlesEngine;
