/**
 * ============================================================================
 * BACKGROUND PARTICLE & FLOATING HEARTS ENGINE
 * Creates floating hearts, glowing particles, and subtle sparkles on canvas.
 * ============================================================================
 */

export class BackgroundEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.hearts = [];
        this.maxParticles = 50;
        this.maxHearts = 25;

        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.init();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        this.hearts = [];

        // Create initial particles (glowing dust / sparkles)
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                color: Math.random() > 0.5 ? '#ff758c' : '#e0c3fc',
                alpha: Math.random() * 0.7 + 0.3,
                speedY: -(Math.random() * 0.5 + 0.2),
                speedX: (Math.random() - 0.5) * 0.3,
                pulse: Math.random() * 0.02 + 0.01
            });
        }

        // Create floating hearts
        for (let i = 0; i < this.maxHearts; i++) {
            this.hearts.push(this.createHeart());
        }
    }

    createHeart() {
        return {
            x: Math.random() * this.canvas.width,
            y: this.canvas.height + Math.random() * 200,
            size: Math.random() * 15 + 10,
            speedY: Math.random() * 1 + 0.5,
            speedX: Math.sin(Math.random() * Math.PI * 2) * 0.5,
            rotation: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.6 + 0.4,
            color: Math.random() > 0.3 ? '#ff4b72' : '#ff758c',
            swingAngle: Math.random() * Math.PI * 2,
            swingSpeed: Math.random() * 0.03 + 0.01
        };
    }

    drawHeartShape(x, y, size, color, alpha, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        
        const topCurveHeight = size * 0.3;
        this.ctx.moveTo(0, topCurveHeight);
        // top left curve
        this.ctx.bezierCurveTo(-size / 2, -topCurveHeight, -size, size / 3, 0, size);
        // top right curve
        this.ctx.bezierCurveTo(size, size / 3, size / 2, -topCurveHeight, 0, topCurveHeight);
        
        this.ctx.closePath();
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 10;
        this.ctx.fill();
        this.ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw glowing particles
        for (let p of this.particles) {
            p.y += p.speedY;
            p.x += p.speedX;
            p.alpha += Math.sin(Date.now() * p.pulse) * 0.01;

            if (p.y < 0) p.y = this.canvas.height;
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;

            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 8;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }

        // Update and draw floating hearts
        for (let h of this.hearts) {
            h.y -= h.speedY;
            h.swingAngle += h.swingSpeed;
            h.x += Math.sin(h.swingAngle) * 0.8;

            if (h.y < -50) {
                Object.assign(h, this.createHeart());
                h.y = this.canvas.height + 20;
            }

            this.drawHeartShape(h.x, h.y, h.size, h.color, h.alpha, h.rotation);
        }

        requestAnimationFrame(() => this.animate());
    }
}
