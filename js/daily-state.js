/**
 * Daily shared state: today's order link and pickup person.
 * Resets automatically when the local calendar day changes at 00:00.
 */
class DailyStateManager {
    constructor() {
        this.state = this.createEmptyState();
    }

    getTodayKey(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    createEmptyState() {
        return {
            date: this.getTodayKey(),
            orderLink: '',
            pickupPerson: null,
            lastResetAt: new Date().toISOString()
        };
    }

    load() {
        try {
            const raw = localStorage.getItem(CONFIG.storage.dailyState);
            this.state = raw ? Object.assign(this.createEmptyState(), JSON.parse(raw)) : this.createEmptyState();
        } catch (error) {
            console.error('Failed to load daily state:', error);
            this.state = this.createEmptyState();
        }
        this.ensureFresh();
        return this.state;
    }

    save() {
        localStorage.setItem(CONFIG.storage.dailyState, JSON.stringify(this.state));
    }

    ensureFresh() {
        const today = this.getTodayKey();
        if (this.state.date !== today) {
            this.state = this.createEmptyState();
            this.save();
            if (typeof surveyManager !== 'undefined') {
                surveyManager.resetForToday();
            }
        }
    }

    getState() {
        this.ensureFresh();
        return this.state;
    }

    setOrderLink(link) {
        this.ensureFresh();
        const trimmed = String(link || '').trim();
        if (!trimmed) {
            throw new Error('Link dat com khong duoc de trong.');
        }
        try {
            new URL(trimmed);
        } catch (error) {
            throw new Error('Link dat com phai la URL hop le.');
        }
        this.state.orderLink = trimmed;
        this.save();
        return this.state;
    }

    setPickupPerson(person) {
        this.ensureFresh();
        this.state.pickupPerson = person ? {
            id: person.id,
            name: person.name,
            avatar: person.avatar || person.emoji || '',
            setAt: new Date().toISOString()
        } : null;
        this.save();
        return this.state;
    }

    resetToday() {
        this.state = this.createEmptyState();
        this.save();
        if (typeof surveyManager !== 'undefined') {
            surveyManager.resetForToday();
        }
        return this.state;
    }
}

const dailyStateManager = new DailyStateManager();
