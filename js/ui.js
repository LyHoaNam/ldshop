/**
 * UI Module
 * Handles rendering and UI interactions
 */

class UIManager {
    /**
     * Initialize avatar picker
     */
    static initializeAvatarPicker() {
        const picker = document.querySelector(CONFIG.selectors.avatarPicker);
        if (!picker) return;

        picker.innerHTML = CONFIG.avatarEmojis.map(emoji =>
            `<div class="avatar-option ${emoji === dataManager.selectedAvatar ? 'selected' : ''}" 
                  onclick="uiManager.selectAvatar('${emoji}')">${emoji}</div>`
        ).join('');
    }

    /**
     * Select avatar
     * @param {string} emoji - Avatar emoji
     */
    selectAvatar(emoji) {
        dataManager.setSelectedAvatar(emoji);
        this.initializeAvatarPicker();
    }

    /**
     * Render racer management grid
     */
    static renderRacerGrid() {
        const grid = document.querySelector(CONFIG.selectors.racerGrid);
        if (!grid) return;

        const racers = dataManager.getAllRacers();

        if (racers.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #8B4513;">Chưa có người đua nào. Hãy thêm người đầu tiên!</p>';
            return;
        }

        grid.innerHTML = racers.map(racer => {
            const isSelected = dataManager.getSelectedRacers().find(r => r.id === racer.id);
            return `
                <div class="racer-card ${isSelected ? 'selected' : ''}" onclick="uiManager.toggleRacerSelection(${racer.id})">
                    <div class="racer-card-avatar"><img src="${racer.avatar}" alt="${racer.name}" /></div>
                    <div class="racer-card-name">${racer.name}</div>
                    <div style="font-size: 0.8rem; color: #8B4513; margin-bottom: 0.5rem;">🏆 ${racer.wins || 0} thắng</div>
                    <div class="racer-card-actions" onclick="event.stopPropagation()">
                        <button class="btn btn-secondary btn-small" onclick="uiManager.deleteRacer(${racer.id})">🗑️</button>
                    </div>
                    ${isSelected ? '<div style="margin-top: 0.5rem; color: #DA251D; font-weight: 700;">✓ Đã chọn</div>' : ''}
                </div>
            `;
        }).join('');
    }

    /**
     * Toggle racer selection
     * @param {number} id - Racer ID
     */
    static toggleRacerSelection(id) {
        dataManager.toggleRacerSelection(id);
        this.renderRacerGrid();
        this.updateRaceTrack();
    }

    /**
     * Delete racer
     * @param {number} id - Racer ID
     */
    static deleteRacer(id) {
        const racer = dataManager.getRacerById(id);
        if (!racer) return;

        if (confirm(`Bạn có chắc muốn xóa ${racer.name}?`)) {
            dataManager.deleteRacer(id);
            this.renderRacerGrid();
            this.updateRaceTrack();
        }
    }

    /**
     * Update race track display (People mode)
     */
    static updateRaceTrack() {
        const lanes = document.querySelector(CONFIG.selectors.lanes);
        const emptyState = document.querySelector(CONFIG.selectors.emptyState);

        if (!lanes || !emptyState) return;

        const selectedRacers = dataManager.getSelectedRacers();

        if (selectedRacers.length === 0) {
            lanes.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        lanes.innerHTML = selectedRacers.map(racer => `
            <div class="lane">
                <div class="racer" data-racer-id="${racer.id}">
                    <div class="racer-avatar"><img src="${racer.avatar}" alt="${racer.name}"/></div>
                    <div class="racer-name">${racer.name}</div>
                    <div class="sprite-runner" id="sprite-${racer.id}"></div>
                    <span class="speed-lines">❯❯❯❯</span>
                </div>
            </div>
        `).join('');

        this.checkSpritesheet();
    }

    /**
     * Update race track display (Stores mode)
     */
    static updateRaceTrackForStores() {
        const lanes = document.querySelector(CONFIG.selectors.lanes);
        const emptyState = document.querySelector(CONFIG.selectors.emptyState);

        if (!lanes || !emptyState) return;

        const selectedStores = storeManager.getSelectedStores();

        if (selectedStores.length === 0) {
            lanes.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        lanes.innerHTML = selectedStores.map(store => `
            <div class="lane">
                <div class="racer" data-racer-id="${store.id}">
                    <div class="racer-avatar">${store.emoji}</div>
                    <div class="racer-name">${store.name}</div>
                    <span class="speed-lines">❯❯❯❯</span>
                </div>
            </div>
        `).join('');
    }

    /**
     * Check if spritesheet exists; apply fallback emoji class if not
     */
    static checkSpritesheet() {
        const img = new Image();
        img.onload = () => {
            // Spritesheet found — CSS animation handles frames
            console.log('Spritesheet loaded:', CONFIG.sprite.sheetPath);
        };
        img.onerror = () => {
            // Spritesheet missing — show fallback emoji
            document.querySelectorAll('.sprite-runner').forEach(el => {
                el.classList.add('fallback-emoji');
            });
        };
        img.src = CONFIG.sprite.sheetPath;
    }

    /**
     * Toggle management panel visibility
     */
    static toggleManagement() {
        const panel = document.querySelector(CONFIG.selectors.racerManagement);
        if (!panel) return;

        panel.classList.toggle('hidden');
    }

    /**
     * Show winner modal
     * @param {object} winner - Winner racer or store object
     * @param {string} type   - 'racer' | 'store'
     */
    static showWinnerModal(winner, type = 'racer') {
        const modal    = document.querySelector(CONFIG.selectors.winnerModal);
        const avatarEl = document.querySelector(CONFIG.selectors.winnerAvatar);
        const nameEl   = document.querySelector(CONFIG.selectors.winnerName);
        const tagsEl   = document.querySelector(CONFIG.selectors.winnerTags);
        const msgEl    = document.getElementById('winnerMessage');
        const titleEl  = document.getElementById('winnerTitle');
        const secBtn   = document.getElementById('winnerSecondaryBtn');

        if (!modal || !avatarEl || !nameEl) return;

        if (type === 'store') {
            // Store winner
            avatarEl.textContent = winner.emoji || '🏪';
            nameEl.textContent   = winner.name;
            if (titleEl) titleEl.textContent = '🏆 QUÁN THẮNG CUỘC 🏆';
            if (msgEl)   msgEl.textContent   = '🎉 Quán này thắng rồi! Đặt đồ ăn thôi! 🛵';
            if (secBtn) {
                secBtn.textContent = '🏪 Chọn quán khác';
                secBtn.onclick = () => { closeWinnerModal(); toggleStoreManagement(); };
            }
            // Render tag pills
            if (tagsEl) {
                if (winner.tags && winner.tags.length > 0) {
                    tagsEl.innerHTML = winner.tags
                        .map(t => `<span class="tag-pill">${t}</span>`)
                        .join('');
                    tagsEl.classList.remove('hidden');
                } else {
                    tagsEl.innerHTML = '';
                    tagsEl.classList.add('hidden');
                }
            }
        } else {
            // Racer winner
            avatarEl.querySelector('img').src = winner.avatar;
            avatarEl.querySelector('img').alt = winner.name;
            nameEl.textContent   = winner.name;
            if (titleEl) titleEl.textContent = '👑 NGƯỜI MAY MẮN 👑';
            if (msgEl)   msgEl.textContent   = '🍚 Hôm nay bạn lấy cơm nhé! 🥢';
            if (secBtn) {
                secBtn.textContent = '👥 Chọn người khác';
                secBtn.onclick = () => { closeWinnerModal(); toggleManagement(); };
            }
            if (tagsEl) {
                tagsEl.innerHTML = '';
                tagsEl.classList.add('hidden');
            }
        }

        modal.style.display = 'flex';
        this.createConfetti();
    }

    /**
     * Close winner modal
     */
    static closeWinnerModal() {
        const modal = document.querySelector(CONFIG.selectors.winnerModal);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Create confetti animation
     */
    static createConfetti() {
        const { count, colors, duration, delay } = CONFIG.confetti;

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), duration);
            }, i * delay);
        }
    }

    /**
     * Export data as JSON file
     */
    static exportData() {
        const jsonStr = dataManager.exportToJSON();
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tiemcom-racers-${new Date().getTime()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        console.log('Data exported');
    }

    /**
     * Import data from JSON file
     * @param {event} event - File input change event
     */
    static importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                dataManager.importFromJSON(data);
                this.renderRacerGrid();
                this.updateRaceTrack();
                alert('✅ Nhập dữ liệu thành công!');
            } catch (error) {
                alert('❌ Lỗi: ' + error.message);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    /**
     * Switch between People and Stores mode
     * @param {string} mode - 'people' | 'stores'
     */
    static switchMode(mode) {
        currentMode = mode;

        // Update tab active state
        const tabPeople = document.querySelector(CONFIG.selectors.tabPeople);
        const tabStores = document.querySelector(CONFIG.selectors.tabStores);
        if (tabPeople) tabPeople.classList.toggle('active', mode === 'people');
        if (tabStores) tabStores.classList.toggle('active', mode === 'stores');

        // Swap manage buttons
        const managePeopleBtn = document.getElementById('managePeopleBtn');
        const manageStoresBtn = document.getElementById('manageStoresBtn');
        if (managePeopleBtn) managePeopleBtn.classList.toggle('hidden', mode === 'stores');
        if (manageStoresBtn) manageStoresBtn.classList.toggle('hidden', mode === 'people');

        // Close any open management panels
        const racerPanel = document.querySelector(CONFIG.selectors.racerManagement);
        const storePanel = document.querySelector(CONFIG.selectors.storeManagement);
        if (racerPanel) racerPanel.classList.add('hidden');
        if (storePanel) storePanel.classList.add('hidden');

        // Update race track for new mode
        if (mode === 'stores') {
            this.updateRaceTrackForStores();
        } else {
            this.updateRaceTrack();
        }

        console.log('Mode switched to:', mode);
    }

    /**
     * Toggle store management panel visibility
     */
    static toggleStoreManagement() {
        const panel = document.querySelector(CONFIG.selectors.storeManagement);
        if (!panel) return;
        panel.classList.toggle('hidden');
    }

    /**
     * Initialize store emoji picker
     */
    static initStoreEmojiPicker() {
        const picker = document.querySelector('#storeEmojiPicker');
        if (!picker) return;

        picker.innerHTML = CONFIG.storeEmojis.map(emoji =>
            `<div class="avatar-option ${emoji === storeManager.selectedEmoji ? 'selected' : ''}"
                  onclick="selectStoreEmoji('${emoji}')">${emoji}</div>`
        ).join('');
    }

    /**
     * Select store emoji
     * @param {string} emoji
     */
    static selectStoreEmoji(emoji) {
        storeManager.setSelectedEmoji(emoji);
        this.initStoreEmojiPicker();
    }

    /**
     * Render store management grid
     */
    static renderStoreGrid() {
        const grid = document.querySelector(CONFIG.selectors.storeGrid);
        if (!grid) return;

        const stores = storeManager.getAllStores();

        if (stores.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #EDD9A3;">Chưa có quán nào. Hãy thêm quán đầu tiên!</p>';
            return;
        }

        grid.innerHTML = stores.map(store => {
            const isSelected = storeManager.getSelectedStores().find(s => s.id === store.id);
            const tagPills = (store.tags || []).map(t => `<span class="tag-pill">${t}</span>`).join('');
            return `
                <div class="racer-card ${isSelected ? 'selected' : ''}" onclick="uiManager.toggleStoreSelection(${store.id})">
                    <div class="racer-card-avatar">${store.emoji}</div>
                    <div class="racer-card-name">${store.name}</div>
                    <div style="margin: 0.4rem 0;">${tagPills}</div>
                    <div style="font-size: 0.8rem; color: #5C3A1E; margin-bottom: 0.5rem;">🏆 ${store.wins || 0} thắng</div>
                    <div class="racer-card-actions" onclick="event.stopPropagation()">
                        <button class="btn btn-secondary btn-small" onclick="uiManager.deleteStore(${store.id})">🗑️</button>
                    </div>
                    ${isSelected ? '<div style="margin-top: 0.5rem; color: #B03020; font-weight: 700;">✓ Đã chọn</div>' : ''}
                </div>
            `;
        }).join('');
    }

    /**
     * Toggle store selection
     * @param {number} id - Store ID
     */
    static toggleStoreSelection(id) {
        storeManager.toggleStoreSelection(id);
        this.renderStoreGrid();
        this.updateRaceTrackForStores();
    }

    /**
     * Delete a store
     * @param {number} id - Store ID
     */
    static deleteStore(id) {
        const store = storeManager.getStoreById(id);
        if (!store) return;

        if (confirm(`Bạn có chắc muốn xóa quán "${store.name}"?`)) {
            storeManager.deleteStore(id);
            this.renderStoreGrid();
            this.updateRaceTrackForStores();
        }
    }

    /**
     * Add a new store from form inputs
     */
    static addStore() {
        const nameInput = document.querySelector(CONFIG.selectors.newStoreName);
        const tagsInput = document.querySelector(CONFIG.selectors.newStoreTags);
        if (!nameInput) return;

        try {
            const name = nameInput.value;
            const tags = tagsInput && tagsInput.value
                ? tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
                : [];
            storeManager.addStore(name, storeManager.selectedEmoji, tags);
            this.renderStoreGrid();
            this.updateRaceTrackForStores();
            nameInput.value = '';
            if (tagsInput) tagsInput.value = '';
            storeManager.setSelectedEmoji(CONFIG.storeEmojis[0]);
            this.initStoreEmojiPicker();
        } catch (error) {
            alert('❌ ' + error.message);
        }
    }

    /**
     * Export store data as JSON file
     */
    static exportStoreData() {
        const jsonStr = storeManager.exportToJSON();
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tiemcom-stores-${new Date().getTime()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        console.log('Store data exported');
    }

    /**
     * Import store data from JSON file
     * @param {Event} event - File input change event
     */
    static importStoreData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                storeManager.importFromJSON(data);
                this.renderStoreGrid();
                this.updateRaceTrackForStores();
                alert('✅ Nhập dữ liệu quán thành công!');
            } catch (error) {
                alert('❌ Lỗi: ' + error.message);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    /**
     * Add new racer
     */
    static addRacer() {
        const nameInput = document.querySelector(CONFIG.selectors.newRacerName);
        if (!nameInput) return;

        try {
            const name = nameInput.value;
            dataManager.addRacer(name, dataManager.selectedAvatar);
            this.renderRacerGrid();
            this.updateRaceTrack();
            nameInput.value = '';
            dataManager.setSelectedAvatar(CONFIG.avatarEmojis[0]);
            this.initializeAvatarPicker();
        } catch (error) {
            alert('❌ ' + error.message);
        }
    }

    /**
     * Initialize UI
     */
    static init() {
        this.initializeAvatarPicker();
        this.renderRacerGrid();
        this.updateRaceTrack();
    }
}

// Create global UI manager instance
const uiManager = UIManager;

// ─── Global function shims for store mode (used by inline onclick handlers) ───

function switchMode(mode) { uiManager.switchMode(mode); }
function toggleStoreManagement() { uiManager.toggleStoreManagement(); }
function addStore() { uiManager.addStore(); }
function exportStoreData() { uiManager.exportStoreData(); }
function importStoreData(event) { uiManager.importStoreData(event); }
function selectStoreEmoji(emoji) { uiManager.selectStoreEmoji(emoji); }

// Override deleteStore / toggleStoreSelection to work for stores
// (racer versions already exist in race.js as globals)
function deleteStore(id) { uiManager.deleteStore(id); }
function toggleStoreSelection(id) { uiManager.toggleStoreSelection(id); }
