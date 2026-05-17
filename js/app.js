/**
 * Main Application Module
 * Initialization and URL setup.
 */

class App {
    static async init() {
        console.log('Tiem Com Nam Vinh - Race App initializing...');

        await dataManager.loadData();
        dailyStateManager.load();
        storeRequestManager.load();
        surveyManager.load();
        await storeManager.loadData();

        uiManager.init();
        this.checkUrlParameters();

        console.log('Application initialized');
    }

    static checkUrlParameters() {
        const params = new URLSearchParams(window.location.search);
        const mode = params.get('mode');
        if (mode === 'stores') {
            uiManager.switchMode('stores');
        }

        const autoStart = params.get('start') === 'true';
        const racerNames = params.get('racers');
        const includeAll = params.get('all') === 'true';
        const runner = params.get('runner');
        const runnerId = params.get('runnerId');
        const forceStart = params.get('force') === 'true';
        const storeNames = params.get('stores');

        if (includeAll) {
            dataManager.selectedRacers = [...dataManager.getAllRacers()];
        } else if (racerNames) {
            const names = racerNames.split(',').map(n => n.trim());
            dataManager.selectedRacers = dataManager.getAllRacers().filter(r => names.includes(r.name));
        } else if (runnerId) {
            dataManager.selectRacersByIds([runnerId]);
        } else if (runner) {
            dataManager.selectRacersByNames([runner]);
        }

        if (mode === 'stores') {
            if (storeNames === 'all') {
                storeManager.selectedStores = [...storeManager.getAllStores()];
            } else if (storeNames) {
                storeManager.selectStoresByNames(storeNames.split(',').map(n => n.trim()));
            }
            if (storeManager.getSelectedStores().length > 0) {
                uiManager.renderStoreGrid();
                uiManager.updateRaceTrackForStores();
            }
        }

        if (dataManager.selectedRacers.length > 0) {
            uiManager.renderRacerGrid();
            uiManager.updateRaceTrack();
        }

        if (autoStart) {
            const opts = {};
            if (forceStart) opts.force = true;
            if (runner) opts.runner = runner;
            if (runnerId) opts.runnerId = runnerId;
            if (mode === 'stores') opts.mode = 'stores';
            startRaceWithOptions(opts);
        }
    }

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

        const adminPassword = document.getElementById('adminPasswordInput');
        if (adminPassword) {
            adminPassword.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') loginAdmin();
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    App.init().then(() => App.setupKeyboardShortcuts());
});

window.addEventListener('load', () => {
    App.setupKeyboardShortcuts();
});
