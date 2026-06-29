/**
 * ============================================================================
 * EVASIVE NO BUTTON ENGINE & EASTER EGG LOGIC (MOBILE OPTIMIZED)
 * Makes the NO button playfully dodge mouse/touch, change texts, scale/rotate,
 * and trigger an Easter egg after 5 attempts.
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

        this.initEvents();
    }

    initEvents() {
        // Proximity detection on mousemove
        window.addEventListener('mousemove', (e) => this.checkProximity(e.clientX, e.clientY));

        // Mobile touch proximity / touchmove / pointerdown
        const handleTouchNear = (e) => {
            if (e.touches && e.touches[0]) {
                this.checkProximity(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        window.addEventListener('touchmove', handleTouchNear, { passive: true });

        // Direct tap attempt on mobile
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
        const rect = this.noBtn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const distance = Math.hypot(x - btnCenterX, y - btnCenterY);
        const threshold = 130; // Increased distance for responsive mobile dodging

        if (distance < threshold) {
            this.dodge();
        }
    }

    dodge() {
        this.attempts++;

        if (!this.isMovedFixed) {
            this.noBtn.style.position = 'fixed';
            this.isMovedFixed = true;
        }

        const btnWidth = this.noBtn.offsetWidth || 120;
        const btnHeight = this.noBtn.offsetHeight || 50;

        const padding = 40;
        const maxX = window.innerWidth - btnWidth - padding;
        const maxY = window.innerHeight - btnHeight - padding;

        const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
        const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

        const randomRotate = (Math.random() - 0.5) * 50;
        const randomScale = Math.random() * 0.35 + 0.75;

        if (window.gsap) {
            gsap.to(this.noBtn, {
                left: `${randomX}px`,
                top: `${randomY}px`,
                rotate: randomRotate,
                scale: randomScale,
                duration: 0.35,
                ease: "power2.out"
            });
        } else {
            this.noBtn.style.left = `${randomX}px`;
            this.noBtn.style.top = `${randomY}px`;
            this.noBtn.style.transform = `rotate(${randomRotate}deg) scale(${randomScale})`;
            this.noBtn.style.transition = 'all 0.35s ease';
        }

        const textOptions = CONFIG.noButtonTexts;
        this.noBtn.textContent = textOptions[this.textIndex % textOptions.length];
        this.textIndex++;

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
