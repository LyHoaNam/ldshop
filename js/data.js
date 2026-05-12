/**
 * Data Management Module
 * Handles CRUD operations for racers and storage
 */

class DataManager {
    constructor() {
        this.racers = [];
        this.selectedRacers = [];
        this.selectedAvatar = CONFIG.avatarEmojis[0];
    }

    /**
     * Load racers from localStorage
     */
    loadData() {
        try {
            const data = localStorage.getItem(CONFIG.storage.racerData);
            if (data) {
                this.racers = JSON.parse(data);
                console.log('Data loaded from localStorage:', this.racers);
                return true;
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
        return false;
    }

    /**
     * Save racers to localStorage
     */
    saveData() {
        try {
            localStorage.setItem(CONFIG.storage.racerData, JSON.stringify(this.racers));
            console.log('Data saved to localStorage');
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    /**
     * Add a new racer
     * @param {string} name - Racer name
     * @param {string} avatar - Avatar emoji
     * @returns {object|null} - New racer object or null if failed
     */
    addRacer(name, avatar) {
        // Validate input
        if (!name || !name.trim()) {
            throw new Error('Tên người đua không được để trống!');
        }

        if (this.racers.find(r => r.name === name)) {
            throw new Error('Tên này đã tồn tại!');
        }

        const newRacer = {
            id: Date.now(),
            name: name.trim(),
            avatar: avatar || CONFIG.avatarEmojis[0],
            wins: 0,
            createdAt: new Date().toISOString()
        };

        this.racers.push(newRacer);
        this.saveData();
        console.log('Racer added:', newRacer);
        return newRacer;
    }

    /**
     * Delete a racer by ID
     * @param {number} id - Racer ID
     * @returns {boolean} - Success status
     */
    deleteRacer(id) {
        const initialLength = this.racers.length;
        this.racers = this.racers.filter(r => r.id !== id);
        
        // Also remove from selected racers
        this.selectedRacers = this.selectedRacers.filter(r => r.id !== id);
        
        if (this.racers.length < initialLength) {
            this.saveData();
            console.log('Racer deleted with ID:', id);
            return true;
        }
        return false;
    }

    /**
     * Get racer by ID
     * @param {number} id - Racer ID
     * @returns {object|null} - Racer object or null
     */
    getRacerById(id) {
        return this.racers.find(r => r.id === id) || null;
    }

    /**
     * Get all racers
     * @returns {array} - Array of racers
     */
    getAllRacers() {
        return this.racers;
    }

    /**
     * Get selected racers
     * @returns {array} - Array of selected racers
     */
    getSelectedRacers() {
        return this.selectedRacers;
    }

    /**
     * Toggle racer selection
     * @param {number} id - Racer ID
     */
    toggleRacerSelection(id) {
        const racer = this.getRacerById(id);
        if (!racer) return;

        const index = this.selectedRacers.findIndex(r => r.id === id);
        if (index > -1) {
            this.selectedRacers.splice(index, 1);
        } else {
            this.selectedRacers.push(racer);
        }
        console.log('Racer selection toggled, selected count:', this.selectedRacers.length);
    }

    /**
     * Clear selected racers
     */
    clearSelection() {
        this.selectedRacers = [];
    }

    /**
     * Update racer wins
     * @param {number} id - Racer ID
     */
    addWin(id) {
        const racer = this.getRacerById(id);
        if (racer) {
            racer.wins = (racer.wins || 0) + 1;
            this.saveData();
            console.log(`Racer ${racer.name} won! Total wins: ${racer.wins}`);
        }
    }

    /**
     * Set selected avatar
     * @param {string} avatar - Avatar emoji
     */
    setSelectedAvatar(avatar) {
        if (CONFIG.avatarEmojis.includes(avatar)) {
            this.selectedAvatar = avatar;
        }
    }

    /**
     * Export data as JSON
     * @returns {string} - JSON string
     */
    exportToJSON() {
        const data = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            racers: this.racers
        };
        return JSON.stringify(data, null, 2);
    }

    /**
     * Import data from JSON
     * @param {object} data - Parsed JSON data
     * @returns {boolean} - Success status
     */
    importFromJSON(data) {
        try {
            if (!data.racers || !Array.isArray(data.racers)) {
                throw new Error('Invalid JSON format');
            }

            // Validate racer objects
            data.racers.forEach(racer => {
                if (!racer.name || typeof racer.name !== 'string') {
                    throw new Error('Invalid racer data');
                }
            });

            this.racers = data.racers;
            this.saveData();
            console.log('Data imported successfully');
            return true;
        } catch (error) {
            console.error('Import error:', error);
            throw new Error('Lỗi nhập dữ liệu: ' + error.message);
        }
    }

    /**
     * Reset all data
     */
    resetAll() {
        this.racers = [];
        this.selectedRacers = [];
        this.selectedAvatar = CONFIG.avatarEmojis[0];
        localStorage.removeItem(CONFIG.storage.racerData);
        console.log('All data reset');
    }
}

// Create global data manager instance
const dataManager = new DataManager();
