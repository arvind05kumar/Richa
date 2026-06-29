/**
 * ============================================================================
 * GALLERY & LIVE TIMER ENGINE
 * Manages the memory photo cards grid and live "Together Since" timer.
 * ============================================================================
 */

import { CONFIG } from './config.js';

export class GalleryTimerEngine {
    constructor() {
        this.initTimer();
        this.initGallery();
    }

    initTimer() {
        const startDate = new Date(CONFIG.togetherSinceDate).getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const diff = Math.max(0, now - startDate);

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const daysEl = document.getElementById('timer-days');
            const hoursEl = document.getElementById('timer-hours');
            const minutesEl = document.getElementById('timer-minutes');
            const secondsEl = document.getElementById('timer-seconds');

            if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        };

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    initGallery() {
        const galleryGrid = document.getElementById('gallery-grid');
        if (!galleryGrid) return;

        galleryGrid.innerHTML = '';

        CONFIG.memories.forEach((memory, idx) => {
            const card = document.createElement('div');
            card.className = 'gallery-card glass-panel';
            card.innerHTML = `
                <img src="${memory.url}" alt="${memory.title}" loading="lazy">
                <div class="gallery-overlay">
                    <div class="gallery-card-date">${memory.date || `Memory #${idx + 1}`}</div>
                    <div class="gallery-card-title">${memory.title}</div>
                </div>
            `;
            galleryGrid.appendChild(card);
        });
    }
}
