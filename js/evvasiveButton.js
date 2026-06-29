/**
 * ============================================================================
 * EVASIVE NO BUTTON ENGINE & EASTER EGG LOGIC (SMOOTH & CONSTRAINED)
 * Prevents button from going out of frame and slows down dodging speed.
 * ============================================================================
 */

import { CONFIG } from './config.js';

export class EvasiveButton {
    constructor(noBtnId, yesBtnId, modalId) {
        this.noBtn = document.getElementById(noBtnId);
        this.yesBtn = document.getElementById(yesBtnId);
        this.modal = document.getElementById(modalId);
        if (!this.noBtn || !this.yesBtn) return;

        this.attempts = 0;
        this.textIndex = 0;
        this.isMovedFixed = false;
        this.isAnimating = false;

        this.initEvents();
    }

    initEvents() {
        // Proximity detection on mousemove
        window.addEventListener('mousemove', (e) => this.checkProximity(e.clientX, e.clientY));

        // Mobile touch proximity
        const handleTouchNear = (e) => {
            if (e.touches && e.touches[0]) {
                this.checkProximity(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        window.addEventListener('touchmove', handleTouchNear, { passive: true });

        // Direct tap / click attempt
        const handleDirectTap = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.dodge();
        };

        this.noBtn.addEventListener('touchstart', handleDirectTap, { passive: false });
        this.noBtn.addEventListener('click', handleDirectTap);
        this.noBtn.addEventListener('pointerdown', handleDirectTap);
    }

    checkProximity(x, y) {
        if (this.isAnimating) return;

        const rect = this.noBtn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const distance = Math.hypot(x - btnCenterX, y - btnCenterY);
        // Moderate threshold so it doesn't jump prematurely
        const threshold = window.innerWidth < 600 ? 70 : 90;

        if (distance < threshold) {
            this.dodge();
        }
    }

    dodge() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.attempts++;

        if (!this.isMovedFixed) {
            // Store current position before switching to fixed
            const rect = this.noBtn.getBoundingClientRect();
            this.noBtn.style.position = 'fixed';
            this.noBtn.style.left = `${rect.left}px`;
            this.noBtn.style.top = `${rect.top}px`;
            this.isMovedFixed = true;
        }

        const btnWidth = this.noBtn.offsetWidth || 130;
        const btnHeight = this.noBtn.offsetHeight || 50;

        // Strict safe margins so the button NEVER touches screen edges or goes out of frame
        const paddingX = Math.min(60, window.innerWidth * 0.1);
        const paddingY = Math.min(80, window.innerHeight * 0.1);

        const minX = paddingX;
        const maxX = window.innerWidth - btnWidth - paddingX;

        const minY = paddingY;
        const maxY = window.innerHeight - btnHeight - paddingY;

        // Pick random safe coordinates within viewport
        let randomX = Math.floor(Math.random() * (maxX - minX)) + minX;
        let randomY = Math.floor(Math.random() * (maxY - minY)) + minY;

        // Gentle rotation (-15deg to 15deg) and subtle scale (0.85 to 1.05)
        const randomRotate = (Math.random() - 0.5) * 30;
        const randomScale = Math.random() * 0.2 + 0.85;

        // Smooth, realistic glide duration
        const duration = 0.5;

        if (window.gsap) {
            gsap.to(this.noBtn, {
                left: `${randomX}px`,
                top: `${randomY}px`,
                rotate: randomRotate,
                scale: randomScale,
                duration: duration,
                ease: "power2.out",
                onComplete: () => {
                    this.isAnimating = false;
                }
            });
        } else {
            this.noBtn.style.left = `${randomX}px`;
            this.noBtn.style.top = `${randomY}px`;
            this.noBtn.style.transform = `rotate(${randomRotate}deg) scale(${randomScale})`;
            this.noBtn.style.transition = `all ${duration}s ease`;
            setTimeout(() => {
                this.isAnimating = false;
            }, duration * 1000);
        }

        // Cycle text slowly
        const textOptions = CONFIG.noButtonTexts;
        this.noBtn.textContent = textOptions[this.textIndex % textOptions.length];
        this.textIndex++;

        // Trigger Easter Egg at 5 attempts
        if (this.attempts === 5) {
            this.triggerEasterEgg();
        }
    }

    triggerEasterEgg() {
        if (this.modal) {
            this.modal.classList.add('active');
            
            const closeBtn = this.modal.querySelector('.modal-close-btn');
            if (closeBtn) {
                const closeModal = () => {
                    this.modal.classList.remove('active');
                    closeBtn.removeEventListener('click', closeModal);
                };
                closeBtn.addEventListener('click', closeModal);
            }
        }

        this.yesBtn.classList.add('pulse-highlight');
        if (window.gsap) {
            gsap.to(this.yesBtn, {
                scale: 1.25,
                duration: 0.5,
                repeat: 3,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    }
}
