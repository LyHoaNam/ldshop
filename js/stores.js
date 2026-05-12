/**
 * Store Data Management Module
 * Handles CRUD operations for stores and storage
 * Mirrors DataManager pattern for consistency
 */

class StoreManager {
    constructor() {
        this.stores = [];
        this.selectedStores = [];
        this.selectedEmoji = CONFIG.storeEmojis[0];
    }

    /**
     * Load stores from localStorage
     */
    loadData() {
        try {
            const data = localStorage.getItem(CONFIG.storage.storeData);
            if (data) {
                this.stores = JSON.parse(data);
                console.log('Store data loaded from localStorage:', this.stores);
                return true;
            }
        } catch (error) {
            console.error('Error loading store data:', error);
        }
        return false;
    }

    /**
     * Save stores to localStorage
     */
    saveData() {
        try {
            localStorage.setItem(CONFIG.storage.storeData, JSON.stringify(this.stores));
            console.log('Store data saved to localStorage');
            return true;
        } catch (error) {
            console.error('Error saving store data:', error);
            return false;
        }
    }

    /**
     * Add a new store
     * @param {string} name - Store name
     * @param {string} emoji - Store emoji icon
     * @param {string[]} tags - Array of food-type tags
     * @returns {object|null} - New store object or null if failed
     */
    addStore(name, emoji, tags) {
        if (!name || !name.trim()) {
            throw new Error('Tên quán không được để trống!');
        }

        const trimmed = name.trim();
        const duplicate = this.stores.find(s => s.name.toLowerCase() === trimmed.toLowerCase());
        if (duplicate) {
            throw new Error(`Quán "${trimmed}" đã tồn tại!`);
        }

        const newStore = {
            id: Date.now(),
            name: trimmed,
            emoji: emoji || CONFIG.storeEmojis[0],
            tags: Array.isArray(tags) ? tags : [],
            wins: 0,
            createdAt: new Date().toISOString()
        };

        this.stores.push(newStore);
        this.saveData();
        console.log('Store added:', newStore);
        return newStore;
    }

    /**
     * Delete a store by ID
     * @param {number} id - Store ID
     */
    deleteStore(id) {
        this.stores = this.stores.filter(s => s.id !== id);
        this.selectedStores = this.selectedStores.filter(s => s.id !== id);
        this.saveData();
        console.log('Store deleted:', id);
    }

    /**
     * Get store by ID
     * @param {number} id - Store ID
     * @returns {object|null}
     */
    getStoreById(id) {
        return this.stores.find(s => s.id === id) || null;
    }

    /**
     * Get all stores
     * @returns {object[]}
     */
    getAllStores() {
        return this.stores;
    }

    /**
     * Get currently selected stores
     * @returns {object[]}
     */
    getSelectedStores() {
        return this.selectedStores;
    }

    /**
     * Toggle store selection for race participation
     * @param {number} id - Store ID
     */
    toggleStoreSelection(id) {
        const store = this.getStoreById(id);
        if (!store) return;

        const index = this.selectedStores.findIndex(s => s.id === id);
        if (index === -1) {
            this.selectedStores.push(store);
        } else {
            this.selectedStores.splice(index, 1);
        }
        console.log('Store selection toggled:', id, 'Selected:', this.selectedStores.length);
    }

    /**
     * Clear all selections
     */
    clearSelection() {
        this.selectedStores = [];
    }

    /**
     * Increment win count for a store
     * @param {number} id - Store ID
     */
    addWin(id) {
        const store = this.getStoreById(id);
        if (store) {
            store.wins = (store.wins || 0) + 1;
            this.saveData();
            console.log('Store win added:', store.name, 'Total wins:', store.wins);
        }
    }

    /**
     * Set selected emoji for new store form
     * @param {string} emoji
     */
    setSelectedEmoji(emoji) {
        this.selectedEmoji = emoji;
    }

    /**
     * Export stores as JSON string
     * @returns {string}
     */
    exportToJSON() {
        return JSON.stringify({
            version: '1.0',
            exportDate: new Date().toISOString(),
            stores: this.stores
        }, null, 2);
    }

    /**
     * Import stores from parsed JSON data
     * @param {object} data - Parsed JSON object with stores array
     */
    importFromJSON(data) {
        if (!data || !Array.isArray(data.stores)) {
            throw new Error('File JSON không hợp lệ! Cần có trường "stores".');
        }
        this.stores = data.stores;
        this.selectedStores = [];
        this.saveData();
        console.log('Store data imported:', this.stores.length, 'stores');
    }

    /**
     * Reset all store data
     */
    resetAll() {
        this.stores = [];
        this.selectedStores = [];
        localStorage.removeItem(CONFIG.storage.storeData);
        console.log('Store data reset');
    }
}

// Global store manager instance
const storeManager = new StoreManager();
