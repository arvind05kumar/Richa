/**
 * ============================================================================
 * CURSOR HEART TRAIL ENGINE
 * Emits mini floating hearts following user cursor / touch.
 * ============================================================================
 */

export class CursorTrailEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.trailParticles = [];
        this.lastX = 0;
        this.lastY = 0;
        this.throttleDist = 15;

        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        const handleMove = (x, y) => {
            const dist = Math.hypot(x - this.lastX, y - this.lastY);
            if (dist > this.throttleDist) {
                this.addHeart(x, y);
                this.lastX = x;
                this.lastY = y;
            }
        };

        window.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
        window.addEventListener('touchmove', (e) => {
            if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
        });

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addHeart(x, y) {
        this.trailParticles.push({
            x: x,
            y: y,
            size: Math.random() * 8 + 6,
            alpha: 1,
            speedY: -(Math.random() * 1.5 + 0.8),
            speedX: (Math.random() - 0.5) * 1.2,
            color: Math.random() > 0.5 ? '#ff4b72' : '#ff758c',
            rotation: (Math.random() - 0.5) * 0.5
        });
    }

    drawMiniHeart(x, y, size, color, alpha, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        
        const top = size * 0.3;
        this.ctx.moveTo(0, top);
        this.ctx.bezierCurveTo(-size / 2, -top, -size, size / 3, 0, size);
        this.ctx.bezierCurveTo(size, size / 3, size / 2, -top, 0, top);
        
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.trailParticles.length - 1; i >= 0; i--) {
            let p = this.trailParticles[i];
            p.y += p.speedY;
            p.x += p.speedX;
            p.alpha -= 0.025;
            p.size *= 0.98;

            if (p.alpha <= 0 || p.size < 2) {
                this.trailParticles.splice(i, 1);
                continue;
            }

            this.drawMiniHeart(p.x, p.y, p.size, p.color, p.alpha, p.rotation);
        }

        requestAnimationFrame(() => this.animate());
    }
}
