/**
 * Store request queue. Uses a shared JSON file when selected, otherwise
 * localStorage so the UI remains useful in browsers without file write access.
 */
class StoreRequestManager {
    constructor() {
        this.requests = [];
        this.fileHandle = null;
    }

    emptyDocument() {
        return {
            version: '1.0',
            exportDate: new Date().toISOString(),
            requests: []
        };
    }

    load() {
        try {
            const raw = localStorage.getItem(CONFIG.storage.storeRequests);
            this.requests = raw ? JSON.parse(raw) : [];
        } catch (error) {
            console.error('Failed to load store requests:', error);
            this.requests = [];
        }
    }

    saveLocal() {
        localStorage.setItem(CONFIG.storage.storeRequests, JSON.stringify(this.requests));
    }

    saveMine(request) {
        try {
            const raw = sessionStorage.getItem(CONFIG.storage.myStoreRequests);
            const mine = raw ? JSON.parse(raw) : [];
            mine.unshift(request);
            sessionStorage.setItem(CONFIG.storage.myStoreRequests, JSON.stringify(mine));
        } catch (error) {
            console.error('Failed to save session request:', error);
        }
    }

    getMine() {
        try {
            const raw = sessionStorage.getItem(CONFIG.storage.myStoreRequests);
            return raw ? JSON.parse(raw) : [];
        } catch (error) {
            return [];
        }
    }

    async openRequestsFile() {
        this.fileHandle = await JsonFileManager.openJsonFile();
        const data = await JsonFileManager.read(this.fileHandle);
        if (!Array.isArray(data.requests)) {
            throw new Error('File request can co truong "requests" la array.');
        }
        this.requests = data.requests;
        this.saveLocal();
        return this.requests;
    }

    async persist() {
        this.saveLocal();
        if (this.fileHandle) {
            await JsonFileManager.write(this.fileHandle, {
                version: '1.0',
                exportDate: new Date().toISOString(),
                requests: this.requests
            });
        }
    }

    getAll() {
        return this.requests;
    }

    getPending() {
        return this.requests.filter(request => request.status === 'pending');
    }

    validate(input) {
        const name = String(input.name || '').trim();
        const emoji = String(input.emoji || '').trim();
        const tags = Array.isArray(input.tags) ? input.tags.map(t => String(t).trim()).filter(Boolean) : [];

        if (!name) throw new Error('Ten quan khong duoc de trong.');
        if (!emoji) throw new Error('Hay chon icon cho quan.');
        if (tags.length === 0) throw new Error('Hay nhap it nhat 1 tag.');

        const existsInStores = storeManager.getAllStores().some(store => store.name.toLowerCase() === name.toLowerCase());
        if (existsInStores) throw new Error('Quan nay da co trong danh sach.');

        const existsPending = this.requests.some(request =>
            request.status === 'pending' && request.name.toLowerCase() === name.toLowerCase()
        );
        if (existsPending) throw new Error('Quan nay dang nam trong danh sach request.');

        return {
            name,
            emoji,
            tags,
            note: String(input.note || '').trim()
        };
    }

    async addRequest(input) {
        const valid = this.validate(input);
        const request = {
            id: Date.now(),
            name: valid.name,
            emoji: valid.emoji,
            tags: valid.tags,
            note: valid.note,
            status: 'pending',
            createdAt: new Date().toISOString(),
            resolvedAt: null
        };
        this.requests.push(request);
        await this.persist();
        this.saveMine(request);
        return request;
    }

    async approve(id) {
        const request = this.requests.find(item => Number(item.id) === Number(id));
        if (!request || request.status !== 'pending') {
            throw new Error('Request khong ton tai hoac da duoc xu ly.');
        }
        const store = await storeManager.addStore(request.name, request.emoji, request.tags);
        request.status = 'approved';
        request.resolvedAt = new Date().toISOString();
        await this.persist();
        return store;
    }

    async reject(id) {
        const request = this.requests.find(item => Number(item.id) === Number(id));
        if (!request || request.status !== 'pending') {
            throw new Error('Request khong ton tai hoac da duoc xu ly.');
        }
        request.status = 'rejected';
        request.resolvedAt = new Date().toISOString();
        await this.persist();
        return request;
    }
}

const storeRequestManager = new StoreRequestManager();
