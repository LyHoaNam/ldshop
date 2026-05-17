/**
 * Store Data Management Module
 * Handles store data loaded from quan-an.json plus localStorage fallback.
 */

class StoreManager {
    constructor() {
        this.stores = [];
        this.selectedStores = [];
        this.selectedEmoji = CONFIG.storeEmojis[0];
        this.fileHandle = null;
    }

    async loadData() {
        // User-facing store data must come from the server JSON first.
        // localStorage is only a fallback for offline/file-write scenarios.
        try {
            const response = await fetch(`${CONFIG.files.storeData}?v=${Date.now()}`, { cache: 'no-store' });
            if (response.ok) {
                const json = await response.json();
                this.importFromJSON(json, { persist: false });
                this.saveData();
                console.log('Store data loaded from server JSON:', this.stores);
                return true;
            }
            console.warn('Failed to fetch store JSON:', response.status, response.statusText);
        } catch (error) {
            console.error('Error fetching store JSON:', error);
        }

        try {
            const data = localStorage.getItem(CONFIG.storage.storeData);
            if (data) {
                const parsed = JSON.parse(data);
                this.stores = Array.isArray(parsed) ? parsed : [];
                console.log('Store data loaded from localStorage fallback:', this.stores);
                return true;
            }
        } catch (error) {
            console.error('Error loading local store fallback:', error);
        }

        this.stores = [];
        return false;
    }

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

    exportDocument() {
        return {
            version: '1.0',
            exportDate: new Date().toISOString(),
            stores: this.stores
        };
    }

    exportToJSON() {
        return JSON.stringify(this.exportDocument(), null, 2);
    }

    async persistToFileIfAvailable() {
        this.saveData();
        if (this.fileHandle) {
            await JsonFileManager.write(this.fileHandle, this.exportDocument());
        }
    }

    async openStoreFile() {
        this.fileHandle = await JsonFileManager.openJsonFile();
        const data = await JsonFileManager.read(this.fileHandle);
        this.importFromJSON(data);
        return this.stores;
    }

    importFromJSON(data, options = {}) {
        if (!data || !Array.isArray(data.stores)) {
            throw new Error('File JSON khong hop le. Can co truong "stores".');
        }
        this.stores = data.stores;
        this.selectedStores = [];
        if (options.persist !== false) {
            this.saveData();
        }
        console.log('Store data imported:', this.stores.length, 'stores');
    }

    validateStoreInput(name, emoji, tags) {
        const trimmed = String(name || '').trim();
        const cleanEmoji = String(emoji || '').trim();
        const cleanTags = Array.isArray(tags)
            ? tags.map(t => String(t).trim()).filter(Boolean)
            : [];

        if (!trimmed) throw new Error('Ten quan khong duoc de trong.');
        if (!cleanEmoji) throw new Error('Hay chon icon cho quan.');
        if (cleanTags.length === 0) throw new Error('Hay nhap it nhat 1 tag.');

        const duplicate = this.stores.find(store => store.name.toLowerCase() === trimmed.toLowerCase());
        if (duplicate) throw new Error(`Quan "${trimmed}" da ton tai.`);

        return { name: trimmed, emoji: cleanEmoji, tags: cleanTags };
    }

    nextId() {
        return this.stores.reduce((max, store) => Math.max(max, Number(store.id) || 0), 0) + 1;
    }

    async addStore(name, emoji, tags) {
        const valid = this.validateStoreInput(name, emoji, tags);
        const newStore = {
            id: this.nextId(),
            name: valid.name,
            emoji: valid.emoji,
            tags: valid.tags,
            wins: 0,
            createdAt: new Date().toISOString()
        };

        this.stores.push(newStore);
        await this.persistToFileIfAvailable();
        console.log('Store added:', newStore);
        return newStore;
    }

    async deleteStore(id) {
        const numberId = Number(id);
        const initialLength = this.stores.length;
        this.stores = this.stores.filter(store => Number(store.id) !== numberId);
        this.selectedStores = this.selectedStores.filter(store => Number(store.id) !== numberId);

        if (this.stores.length < initialLength) {
            await this.persistToFileIfAvailable();
            console.log('Store deleted:', id);
            return true;
        }
        return false;
    }

    async updateStore(id, input) {
        const store = this.getStoreById(id);
        if (!store) throw new Error('Khong tim thay quan.');

        const name = String(input.name || '').trim();
        const emoji = String(input.emoji || '').trim();
        const tags = Array.isArray(input.tags) ? input.tags.map(t => String(t).trim()).filter(Boolean) : [];
        if (!name) throw new Error('Ten quan khong duoc de trong.');
        if (!emoji) throw new Error('Icon quan khong duoc de trong.');
        if (tags.length === 0) throw new Error('Hay nhap it nhat 1 tag.');

        const duplicate = this.stores.find(item =>
            Number(item.id) !== Number(id) && item.name.toLowerCase() === name.toLowerCase()
        );
        if (duplicate) throw new Error(`Quan "${name}" da ton tai.`);

        store.name = name;
        store.emoji = emoji;
        store.tags = tags;
        store.updatedAt = new Date().toISOString();
        await this.persistToFileIfAvailable();
        return store;
    }

    getStoreById(id) {
        return this.stores.find(store => Number(store.id) === Number(id)) || null;
    }

    getAllStores() {
        return this.stores;
    }

    getSelectedStores() {
        return this.selectedStores;
    }

    toggleStoreSelection(id) {
        const store = this.getStoreById(id);
        if (!store) return;

        const index = this.selectedStores.findIndex(item => Number(item.id) === Number(id));
        if (index === -1) {
            this.selectedStores.push(store);
        } else {
            this.selectedStores.splice(index, 1);
        }
        console.log('Store selection toggled:', id, 'Selected:', this.selectedStores.length);
    }

    clearSelection() {
        this.selectedStores = [];
    }

    async addWin(id) {
        const store = this.getStoreById(id);
        if (store) {
            store.wins = (store.wins || 0) + 1;
            await this.persistToFileIfAvailable();
            console.log('Store win added:', store.name, 'Total wins:', store.wins);
        }
    }

    setSelectedEmoji(emoji) {
        this.selectedEmoji = emoji;
    }

    resetAll() {
        this.stores = [];
        this.selectedStores = [];
        localStorage.removeItem(CONFIG.storage.storeData);
        console.log('Store data reset');
    }

    selectStoresByNames(names) {
        if (!Array.isArray(names) || names.length === 0) return;
        const set = new Set(names.map(name => name.trim()));
        this.selectedStores = this.stores.filter(store => set.has(store.name));
        console.log('Selected stores by names:', this.selectedStores.map(store => store.name));
    }

    selectStoresByIds(ids) {
        if (!Array.isArray(ids) || ids.length === 0) return;
        const idSet = new Set(ids.map(id => Number(id)));
        this.selectedStores = this.stores.filter(store => idSet.has(Number(store.id)));
        console.log('Selected stores by ids:', this.selectedStores.map(store => store.id));
    }
}

const storeManager = new StoreManager();
