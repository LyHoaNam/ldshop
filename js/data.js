/**
 * Data Management Module
 * Handles runner CRUD, runner.json read/write, and localStorage fallback.
 */

class DataManager {
    constructor() {
        this.racers = [];
        this.selectedRacers = [];
        this.selectedAvatar = 'assets/avatars/bachune.png';
        this.fileHandle = null;
    }

    async loadData() {
        try {
            const data = localStorage.getItem(CONFIG.storage.racerData);
            if (data) {
                this.racers = JSON.parse(data);
                console.log('Runner data loaded from localStorage:', this.racers);
                return true;
            }

            const response = await fetch(CONFIG.files.racerData);
            if (response.ok) {
                const json = await response.json();
                this.importFromJSON(json, { persist: false });
                this.saveData();
                console.log('Runner data loaded from JSON seed:', this.racers);
                return true;
            }
        } catch (error) {
            console.error('Error loading runner data:', error);
        }
        return false;
    }

    saveData() {
        try {
            localStorage.setItem(CONFIG.storage.racerData, JSON.stringify(this.racers));
            return true;
        } catch (error) {
            console.error('Error saving runner data:', error);
            return false;
        }
    }

    exportDocument() {
        return {
            version: '1.0',
            exportDate: new Date().toISOString(),
            racers: this.racers
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

    async openRunnerFile() {
        this.fileHandle = await JsonFileManager.openJsonFile();
        const data = await JsonFileManager.read(this.fileHandle);
        this.importFromJSON(data);
        return this.racers;
    }

    validateRacerInput(name, avatar) {
        const trimmed = String(name || '').trim();
        const cleanAvatar = String(avatar || '').trim();
        if (!trimmed) throw new Error('Ten runner khong duoc de trong.');
        if (!cleanAvatar) throw new Error('Avatar/path khong duoc de trong.');

        const duplicate = this.racers.find(r => r.name.toLowerCase() === trimmed.toLowerCase());
        if (duplicate) throw new Error(`Runner "${trimmed}" da ton tai.`);

        return { name: trimmed, avatar: cleanAvatar };
    }

    nextId() {
        return this.racers.reduce((max, racer) => Math.max(max, Number(racer.id) || 0), 0) + 1;
    }

    async addRacer(name, avatar) {
        const valid = this.validateRacerInput(name, avatar);
        const newRacer = {
            id: this.nextId(),
            name: valid.name,
            avatar: valid.avatar,
            wins: 0,
            createdAt: new Date().toISOString()
        };

        this.racers.push(newRacer);
        await this.persistToFileIfAvailable();
        return newRacer;
    }

    async deleteRacer(id) {
        const numberId = Number(id);
        const initialLength = this.racers.length;
        this.racers = this.racers.filter(r => Number(r.id) !== numberId);
        this.selectedRacers = this.selectedRacers.filter(r => Number(r.id) !== numberId);
        if (this.racers.length < initialLength) {
            await this.persistToFileIfAvailable();
            return true;
        }
        return false;
    }

    getRacerById(id) {
        return this.racers.find(r => Number(r.id) === Number(id)) || null;
    }

    getAllRacers() {
        return this.racers;
    }

    getSelectedRacers() {
        return this.selectedRacers;
    }

    toggleRacerSelection(id) {
        const racer = this.getRacerById(id);
        if (!racer) return;

        const index = this.selectedRacers.findIndex(r => Number(r.id) === Number(id));
        if (index > -1) {
            this.selectedRacers.splice(index, 1);
        } else {
            this.selectedRacers.push(racer);
        }
    }

    clearSelection() {
        this.selectedRacers = [];
    }

    async addWin(id) {
        const racer = this.getRacerById(id);
        if (racer) {
            racer.wins = (racer.wins || 0) + 1;
            await this.persistToFileIfAvailable();
        }
    }

    setSelectedAvatar(avatar) {
        this.selectedAvatar = String(avatar || '').trim();
    }

    importFromJSON(data, options = {}) {
        if (!data || !Array.isArray(data.racers)) {
            throw new Error('File JSON khong hop le. Can co truong "racers".');
        }

        data.racers.forEach(racer => {
            if (!racer.name || typeof racer.name !== 'string') {
                throw new Error('Runner data khong hop le.');
            }
        });

        this.racers = data.racers;
        this.selectedRacers = [];
        if (options.persist !== false) {
            this.saveData();
        }
        return true;
    }

    resetAll() {
        this.racers = [];
        this.selectedRacers = [];
        localStorage.removeItem(CONFIG.storage.racerData);
    }

    selectRacersByNames(names) {
        if (!Array.isArray(names) || names.length === 0) return;
        const set = new Set(names.map(n => n.trim()));
        this.selectedRacers = this.racers.filter(r => set.has(r.name));
    }

    selectRacersByIds(ids) {
        if (!Array.isArray(ids) || ids.length === 0) return;
        const idSet = new Set(ids.map(i => Number(i)));
        this.selectedRacers = this.racers.filter(r => idSet.has(Number(r.id)));
    }
}

const dataManager = new DataManager();

