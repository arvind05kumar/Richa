/**
 * ============================================================================
 * PROPOSAL LOGIC & GSAP ANIMATION CONTROLLER
 * Manages intro preloader, landing entrance, scrolling transition,
 * and celebratory YES button triggers with confetti.
 * ============================================================================
 */

import { CONFIG } from './config.js';

export class ProposalController {
    constructor(musicPlayer) {
        this.musicPlayer = musicPlayer;
        this.landingSection = document.getElementById('landing-section');
        this.proposalSection = document.getElementById('proposal-section');
        this.successSection = document.getElementById('success-section');
        this.continueBtn = document.getElementById('continue-btn');
        this.yesBtn = document.getElementById('yes-btn');
        this.preloader = document.getElementById('preloader');

        this.init();
    }

    init() {
        // Hydrate configuration text strings
        const landingTitle = document.querySelector('.landing-title');
        const landingSubtitle = document.querySelector('.landing-subtitle');
        if (landingTitle) landingTitle.textContent = CONFIG.landingHeading;
        if (landingSubtitle) landingSubtitle.textContent = CONFIG.landingSubheading;

        // Hide preloader smoothly after 1.2s
        setTimeout(() => {
            if (this.preloader) {
                this.preloader.style.opacity = '0';
                this.preloader.style.visibility = 'hidden';
            }
            this.animateLanding();
        }, 1200);

        // Bind Continue button
        if (this.continueBtn) {
            this.continueBtn.addEventListener('click', () => this.goToProposal());
        }

        // Allow scroll / wheel on landing to transition down
        let scrollTriggered = false;
        window.addEventListener('wheel', (e) => {
            if (!scrollTriggered && e.deltaY > 20 && this.landingSection && this.landingSection.style.display !== 'none') {
                scrollTriggered = true;
                this.goToProposal();
            }
        });

        // Bind YES button celebration
        if (this.yesBtn) {
            this.yesBtn.addEventListener('click', () => this.celebrateYes());
        }
    }

    animateLanding() {
        if (!window.gsap) return;
        const tl = gsap.timeline();
        tl.to('.landing-title', { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
          .to('.landing-subtitle', { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
          .to('.continue-btn', { opacity: 1, duration: 0.6 }, "-=0.2");
    }

    goToProposal() {
        if (this.musicPlayer && !this.musicPlayer.isPlaying) {
            this.musicPlayer.play();
        }

        if (!window.gsap) {
            this.landingSection.style.display = 'none';
            this.proposalSection.style.display = 'flex';
            this.proposalSection.style.opacity = '1';
            return;
        }

        const tl = gsap.timeline();
        tl.to(this.landingSection, {
            opacity: 0,
            y: -50,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                this.landingSection.style.display = 'none';
                this.proposalSection.style.display = 'flex';
            }
        })
        .to(this.proposalSection, {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        })
        .to('.romantic-message', {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.4,
            ease: "power3.out"
        })
        .to('.proposal-question', {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)"
        }, "-=0.2");
    }

    celebrateYes() {
        // Trigger fullscreen confetti bursts
        this.triggerConfetti();

        // Ensure music is playing
        if (this.musicPlayer && !this.musicPlayer.isPlaying) {
            this.musicPlayer.play();
        }

        if (!window.gsap) {
            this.proposalSection.style.display = 'none';
            this.successSection.style.display = 'flex';
            this.successSection.style.opacity = '1';
            return;
        }

        // Hide proposal section and smoothly introduce success section
        gsap.to(this.proposalSection, {
            opacity: 0,
            scale: 0.9,
            duration: 0.6,
            ease: "power2.in",
            onComplete: () => {
                this.proposalSection.style.display = 'none';
                this.successSection.style.display = 'flex';
                
                // Animate success elements
                const tl = gsap.timeline();
                tl.to(this.successSection, { opacity: 1, duration: 0.8 })
                  .from('.yay-title', { scale: 0.5, opacity: 0, duration: 1, ease: "elastic.out(1, 0.5)" })
                  .from('.happiest-subtitle', { y: 20, opacity: 0, duration: 0.8 }, "-=0.4")
                  .from('.love-forever-reveal', { scale: 0.8, opacity: 0, duration: 1.2, ease: "power3.out" }, "-=0.2")
                  .from('.couple-illustration', { y: 40, opacity: 0, duration: 1, ease: "back.out(1.4)" }, "-=0.5")
                  .from('.journey-start-text', { opacity: 0, duration: 0.8 }, "-=0.3")
                  .from('.gallery-section', { y: 40, opacity: 0, duration: 0.8 }, "-=0.4");
            }
        });
    }

    triggerConfetti() {
        if (typeof confetti === 'function') {
            const count = 200;
            const defaults = {
                origin: { y: 0.7 }
            };

            function fire(particleRatio, opts) {
                confetti({
                    ...defaults,
                    ...opts,
                    particleCount: Math.floor(count * particleRatio)
                });
            }

            fire(0.25, { spread: 26, startVelocity: 55, colors: ['#ff4b72', '#ff758c'] });
            fire(0.2, { spread: 60, colors: ['#ffffff', '#e0c3fc'] });
            fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
            fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, colors: ['#ff3366', '#ff758c'] });
            fire(0.1, { spread: 120, startVelocity: 45 });
        }
    }
}
