/**
 * ============================================================================
 * MUSIC PLAYER ENGINE
 * Manages background music playback, floating toggle, and aggressive autoplay for mobile.
 * ============================================================================
 */

import { CONFIG } from './config.js';

export class MusicPlayer {
    constructor(buttonId) {
        this.btn = document.getElementById(buttonId);
        this.isPlaying = false;
        this.audio = new Audio(CONFIG.audioUrl);
        this.audio.loop = true;
        this.audio.volume = 0.6;

        if (this.btn) {
            this.btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle();
            });
        }

        // Aggressive Autoplay: Attempt play on initialization
        this.play();

        // Backup listeners to unlock audio on ANY touch/scroll/click on mobile
        const unlockAudio = () => {
            if (!this.isPlaying) {
                this.play();
            }
            window.removeEventListener('click', unlockAudio);
            window.removeEventListener('touchstart', unlockAudio);
            window.removeEventListener('scroll', unlockAudio);
            window.removeEventListener('pointerdown', unlockAudio);
        };

        window.addEventListener('click', unlockAudio);
        window.addEventListener('touchstart', unlockAudio, { passive: true });
        window.addEventListener('scroll', unlockAudio, { passive: true });
        window.addEventListener('pointerdown', unlockAudio, { passive: true });
    }

    play() {
        const promise = this.audio.play();
        if (promise !== undefined) {
            promise.then(() => {
                this.isPlaying = true;
                this.updateIcon();
            }).catch((err) => {
                console.log("Autoplay waiting for user gesture:", err);
            });
        }
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updateIcon();
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    updateIcon() {
        if (!this.btn) return;
        if (this.isPlaying) {
            this.btn.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
            `;
            this.btn.title = "Mute Music";
            this.btn.classList.add('playing');
        } else {
            this.btn.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73l4.27 4.27c-.87.5-1.92.81-3.04.81-3.31 0-6-2.69-6-6 0-1.96.94-3.69 2.4-4.77L1.39 4.66 2.66 3.39l18.4 18.4-1.27 1.27L4.27 3zM14 7h4V3h-6v5.18l2 2V7z"/>
                </svg>
            `;
            this.btn.title = "Play Music";
            this.btn.classList.remove('playing');
        }
    }
}
