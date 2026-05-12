/**
 * Race Module
 * Handles race logic and animations
 */

class RaceEngine {
    constructor() {
        this.isRacing = false;
        this.animationFrameId = null;
    }

    /**
     * Validate and start race (mode-aware)
     */
    startRace() {
        if (this.isRacing) return;

        const participants = currentMode === 'stores'
            ? storeManager.getSelectedStores()
            : dataManager.getSelectedRacers();

        if (participants.length < CONFIG.race.minRacers) {
            const noun = currentMode === 'stores' ? 'quán' : 'người';
            alert(`Cần ít nhất ${CONFIG.race.minRacers} ${noun} để đua!`);
            return;
        }

        if (participants.length > CONFIG.race.maxRacers) {
            const noun = currentMode === 'stores' ? 'quán' : 'người';
            alert(`Tối đa ${CONFIG.race.maxRacers} ${noun} mỗi lần đua!`);
            return;
        }

        this.runRace(participants, currentMode);
    }

    /**
     * Route to DOM or canvas renderer
     * @param {array} participants - Racers or stores
     * @param {string} mode - 'people' | 'stores'
     */
    runRace(participants, mode) {
        this.isRacing = true;
        const startBtn = document.querySelector(CONFIG.selectors.startBtn);
        if (startBtn) startBtn.disabled = true;

        // Activate scrolling lane animation
        const track = document.querySelector(CONFIG.selectors.raceTrack);
        if (track) track.classList.add('racing');

        if (CONFIG.renderer.useCanvas) {
            this.runRaceCanvas(participants, mode);
        } else {
            this.runRaceDom(participants, mode);
        }
    }

    /**
     * DOM-based race animation
     * @param {array} participants - Racers or stores
     * @param {string} mode
     */
    runRaceDom(participants, mode) {
        const racerElements = document.querySelectorAll('.racer');
        const laneWidth = document.querySelector('.lane')?.offsetWidth - 150 || 1000;
        const positions = Array(racerElements.length).fill(0);
        const speeds = participants.map(() =>
            CONFIG.race.baseSpeed + (Math.random() * CONFIG.race.speedVariation)
        );

        let winner = null;
        let finished = false;

        const animate = () => {
            if (finished) return;

            racerElements.forEach((element, index) => {
                if (positions[index] < laneWidth) {
                    const speedVariation = (Math.random() - 0.5) * 0.5;
                    positions[index] += (speeds[index] + speedVariation) * 0.1;
                    element.style.left = Math.min(positions[index], laneWidth) + 'px';
                } else if (!winner && !finished) {
                    winner = participants[index];
                    finished = true;
                }
            });

            if (!finished) {
                this.animationFrameId = requestAnimationFrame(animate);
            } else {
                setTimeout(() => this.finishRace(winner, mode), 500);
            }
        };

        animate();
    }

    /**
     * Canvas-based race renderer (opt-in via CONFIG.renderer.useCanvas)
     * @param {array} participants - Racers or stores
     * @param {string} mode
     */
    runRaceCanvas(participants, mode) {
        const track = document.querySelector(CONFIG.selectors.raceTrack);
        const lanesContainer = document.querySelector(CONFIG.selectors.lanes);
        if (!track || !lanesContainer) return;

        lanesContainer.innerHTML = '';
        const canvas = document.createElement('canvas');
        const laneHeight = 90;
        canvas.width  = track.offsetWidth - 64;
        canvas.height = participants.length * laneHeight;
        lanesContainer.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        const laneWidth = canvas.width - 150;
        const positions = Array(participants.length).fill(0);
        const speeds = participants.map(() =>
            CONFIG.race.baseSpeed + Math.random() * CONFIG.race.speedVariation
        );

        // Try loading tile image
        const tileImg = new Image();
        tileImg.src = CONFIG.track.tilePath;
        let tileLoaded = false;
        tileImg.onload = () => { tileLoaded = true; };

        let tileOffset = 0;
        let winner = null;
        let finished = false;

        const draw = () => {
            if (finished) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            tileOffset = (tileOffset + 2) % CONFIG.track.tileWidth;

            participants.forEach((p, i) => {
                const y = i * laneHeight;
                // Lane background
                if (tileLoaded) {
                    for (let x = -tileOffset; x < canvas.width; x += CONFIG.track.tileWidth) {
                        ctx.drawImage(tileImg, x, y, CONFIG.track.tileWidth, laneHeight - 4);
                    }
                } else {
                    ctx.fillStyle = i % 2 === 0 ? '#8A8060' : '#7A7050';
                    ctx.fillRect(0, y, canvas.width, laneHeight - 4);
                    // Pixel stripe
                    ctx.fillStyle = i % 2 === 0 ? '#6A6040' : '#5A5030';
                    for (let x = 0; x < canvas.width; x += 48) {
                        ctx.fillRect(x + 20, y, 4, laneHeight - 4);
                    }
                }

                // Update position
                if (positions[i] < laneWidth) {
                    positions[i] += (speeds[i] + (Math.random() - 0.5) * 0.5) * 0.1;
                    if (positions[i] >= laneWidth && !winner && !finished) {
                        winner = participants[i];
                        finished = true;
                    }
                }

                // Draw avatar emoji
                const displayEmoji = mode === 'stores' ? p.emoji : p.avatar;
                ctx.font = '2rem serif';
                ctx.fillText(displayEmoji || '🏃', positions[i] + 10, y + laneHeight / 2 + 8);

                // Draw name label
                const labelW = p.name.length * 9 + 8;
                ctx.fillStyle = 'rgba(245, 230, 200, 0.92)';
                ctx.fillRect(positions[i] + 58, y + laneHeight / 2 - 14, labelW, 22);
                ctx.fillStyle = '#3B1F0A';
                ctx.font = '13px Nunito, sans-serif';
                ctx.fillText(p.name, positions[i] + 62, y + laneHeight / 2 + 4);
            });

            if (!finished) {
                this.animationFrameId = requestAnimationFrame(draw);
            } else {
                setTimeout(() => this.finishRace(winner, mode), 500);
            }
        };

        draw();
    }

    /**
     * Finish race and show winner
     * @param {object} winner - Winner object (racer or store)
     * @param {string} mode   - 'people' | 'stores'
     */
    finishRace(winner, mode = 'people') {
        if (!winner) return;

        // Update win count
        if (mode === 'stores') {
            storeManager.addWin(winner.id);
        } else {
            dataManager.addWin(winner.id);
        }

        // Show winner modal
        uiManager.showWinnerModal(winner, mode === 'stores' ? 'store' : 'racer');

        this.resetRace();
    }

    /**
     * Reset race state
     */
    resetRace() {
        this.isRacing = false;
        const startBtn = document.querySelector(CONFIG.selectors.startBtn);
        if (startBtn) startBtn.disabled = false;

        // Remove scrolling animation
        const track = document.querySelector(CONFIG.selectors.raceTrack);
        if (track) track.classList.remove('racing');

        // Restore correct track for current mode
        if (currentMode === 'stores') {
            uiManager.updateRaceTrackForStores();
        } else {
            uiManager.updateRaceTrack();
        }
    }

    /**
     * Close winner modal and reset
     */
    closeWinner() {
        uiManager.closeWinnerModal();
        this.resetRace();
    }
}

// Create global race engine instance
const raceEngine = new RaceEngine();

/**
 * Global function to start race
 */
function startRace() {
    raceEngine.startRace();
}

/**
 * Global function to reset race
 */
function resetRace() {
    raceEngine.resetRace();
}

/**
 * Global function to close winner modal
 */
function closeWinnerModal() {
    raceEngine.closeWinner();
}

/**
 * Global function to toggle management
 */
function toggleManagement() {
    uiManager.toggleManagement();
}

/**
 * Global function to add racer
 */
function addRacer() {
    uiManager.addRacer();
}

/**
 * Global function to export data
 */
function exportData() {
    uiManager.exportData();
}

/**
 * Global function to import data
 */
function importData(event) {
    uiManager.importData(event);
}
