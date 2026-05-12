/**
 * Main Application Module
 * Initialization and setup
 */

class App {
    /**
     * Initialize the application
     */
    static init() {
        console.log('🍚 Tiệm Cơm Nam Vinh - Race App initializing...');

        // Load data from localStorage
        dataManager.loadData();
        storeManager.loadData();

        // Initialize UI
        uiManager.init();
        uiManager.initStoreEmojiPicker();
        uiManager.renderStoreGrid();

        // Explicitly set initial mode (people)
        uiManager.switchMode('people');

        // Check URL parameters
        this.checkUrlParameters();

        console.log('✅ Application initialized');
    }

    /**
     * Check URL parameters for auto-start, pre-selection, and mode
     */
    static checkUrlParameters() {
        const params = new URLSearchParams(window.location.search);

        // Mode switch (must happen before racer selection)
        const mode = params.get('mode');
        if (mode === 'stores') {
            uiManager.switchMode('stores');
        }

        const autoStart = params.get('start') === 'true';
        const racerNames = params.get('racers');
        const includeAll = params.get('all') === 'true';

        // Handle racer pre-selection
        if (includeAll) {
            // Select all racers
            dataManager.selectedRacers = [...dataManager.getAllRacers()];
        } else if (racerNames) {
            // Select specific racers by name
            const names = racerNames.split(',').map(n => n.trim());
            const selectedRacers = dataManager.getAllRacers().filter(r => 
                names.includes(r.name)
            );
            dataManager.selectedRacers = selectedRacers;
        }

        // Update UI after selection
        if (dataManager.selectedRacers.length > 0) {
            uiManager.renderRacerGrid();
            uiManager.updateRaceTrack();
        }

        // Auto-start race if requested and valid
        if (autoStart && dataManager.selectedRacers.length >= CONFIG.race.minRacers) {
            setTimeout(() => {
                console.log('Auto-starting race from URL parameter');
                raceEngine.startRace();
            }, 500);
        }
    }

    /**
     * Handle Enter key in input fields
     */
    static setupKeyboardShortcuts() {
        const nameInput = document.querySelector(CONFIG.selectors.newRacerName);
        if (nameInput) {
            nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') addRacer();
            });
        }

        const storeNameInput = document.querySelector(CONFIG.selectors.newStoreName);
        if (storeNameInput) {
            storeNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') addStore();
            });
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    App.setupKeyboardShortcuts();
});

// Also run on window load for safety
window.addEventListener('load', () => {
    App.setupKeyboardShortcuts();
});
