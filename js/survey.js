/**
 * Daily store survey. A browser can select multiple stores for today's vote.
 */
class SurveyManager {
    constructor() {
        this.data = this.createEmpty();
    }

    todayKey(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    getBrowserId() {
        const key = 'dailySurveyBrowserId';
        let browserId = localStorage.getItem(key);
        if (!browserId) {
            browserId = `browser-${Date.now()}-${Math.random().toString(16).slice(2)}`;
            localStorage.setItem(key, browserId);
        }
        return browserId;
    }

    selectedSessionKey() {
        return `${CONFIG.storage.dailySurveyVoteDate}:selectedStores`;
    }

    createEmpty() {
        return {
            date: this.todayKey(),
            votes: []
        };
    }

    load() {
        try {
            const raw = localStorage.getItem(CONFIG.storage.dailySurvey);
            this.data = raw ? JSON.parse(raw) : this.createEmpty();
        } catch (error) {
            console.error('Failed to load survey:', error);
            this.data = this.createEmpty();
        }
        this.ensureFresh();
    }

    ensureFresh() {
        if (this.data.date !== this.todayKey()) {
            this.resetForToday();
        }

        const savedDate = sessionStorage.getItem(CONFIG.storage.dailySurveyVoteDate);
        if (savedDate && savedDate !== this.todayKey()) {
            sessionStorage.removeItem(CONFIG.storage.dailySurveyVoteDate);
            sessionStorage.removeItem(this.selectedSessionKey());
        }
    }

    save() {
        localStorage.setItem(CONFIG.storage.dailySurvey, JSON.stringify(this.data));
    }

    resetForToday() {
        this.data = this.createEmpty();
        localStorage.removeItem(CONFIG.storage.dailySurveyVoteDate);
        sessionStorage.removeItem(CONFIG.storage.dailySurveyVoteDate);
        sessionStorage.removeItem(this.selectedSessionKey());
        this.save();
    }

    getSelectedIdsForBrowser() {
        this.ensureFresh();
        try {
            const savedDate = sessionStorage.getItem(CONFIG.storage.dailySurveyVoteDate);
            const raw = sessionStorage.getItem(this.selectedSessionKey());
            if (savedDate === this.todayKey() && raw) {
                return JSON.parse(raw).map(id => Number(id));
            }
        } catch (error) {
            sessionStorage.removeItem(this.selectedSessionKey());
        }
        return [];
    }

    voteMany(storeIds) {
        this.ensureFresh();
        const ids = Array.from(new Set((storeIds || []).map(id => Number(id)).filter(Boolean)));
        if (ids.length === 0) {
            throw new Error('Hay chon it nhat 1 quan.');
        }

        const stores = ids.map(id => storeManager.getStoreById(id));
        if (stores.some(store => !store)) {
            throw new Error('Danh sach quan vote khong hop le.');
        }

        const browserId = this.getBrowserId();
        this.data.votes = this.data.votes.filter(vote => vote.browserId !== browserId);
        stores.forEach(store => {
            this.data.votes.push({
                id: `${browserId}-${store.id}-${Date.now()}`,
                browserId,
                storeId: store.id,
                storeName: store.name,
                createdAt: new Date().toISOString()
            });
        });
        localStorage.setItem(CONFIG.storage.dailySurveyVoteDate, this.todayKey());
        sessionStorage.setItem(CONFIG.storage.dailySurveyVoteDate, this.todayKey());
        sessionStorage.setItem(this.selectedSessionKey(), JSON.stringify(ids));
        this.save();
        return stores;
    }

    summary(includeEmpty = true) {
        this.ensureFresh();
        const counts = new Map();
        if (includeEmpty) {
            storeManager.getAllStores().forEach((store, index) => {
                counts.set(Number(store.id), {
                    storeId: Number(store.id),
                    storeName: store.name,
                    emoji: store.emoji || '',
                    order: index,
                    count: 0
                });
            });
        }

        this.data.votes.forEach(vote => {
            const key = Number(vote.storeId);
            const current = counts.get(key) || {
                storeId: key,
                storeName: vote.storeName,
                emoji: '',
                order: Number.MAX_SAFE_INTEGER,
                count: 0
            };
            current.count += 1;
            counts.set(key, current);
        });

        return Array.from(counts.values())
            .sort((a, b) => b.count - a.count || a.order - b.order || a.storeName.localeCompare(b.storeName));
    }
}

const surveyManager = new SurveyManager();
