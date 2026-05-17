/**
 * UI Module
 * Handles role-based layout, tabs, race views, survey, and JSON-backed forms.
 */

class UIManager {
    static init() {
        this.requestStoreEmoji = CONFIG.storeEmojis[0];
        this.rankingExpanded = false;
        this.initStoreEmojiPicker();
        this.initRequestEmojiPicker();
        this.renderAll();
    }

    static renderAll() {
        this.renderDailyBanner();
        this.renderAdminState();
        this.renderStoreGrid();
        this.renderRacerGrid();
        this.renderRequestList();
        this.renderMyRequestList();
        this.renderSurveySelect();
        this.renderSurveySummary();
        this.updateRaceTrack();
    }

    static showPanelTab(sectionId, paneId) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        section.querySelectorAll('.tab-pane').forEach(pane => pane.classList.toggle('active', pane.id === paneId));
        section.querySelectorAll('.section-tab').forEach(button => button.classList.remove('active'));
        const buttons = Array.from(section.querySelectorAll('.section-tab'));
        const matched = buttons.find(button => button.getAttribute('onclick')?.includes(`'${paneId}'`));
        if (matched) matched.classList.add('active');
    }

    static switchMode(mode) {
        currentMode = mode === 'stores' ? 'stores' : 'people';
    }

    static toggleManagement() {
        document.getElementById('racerManagement')?.classList.toggle('hidden');
    }

    static toggleStoreManagement() {
        document.getElementById('storeManagement')?.classList.toggle('hidden');
    }

    static renderAdminState() {
        const isAdmin = AuthManager.isAdmin();
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel && isAdmin) adminPanel.classList.remove('hidden');
        document.getElementById('adminLoginRow')?.classList.toggle('hidden', isAdmin);
        document.getElementById('adminTools')?.classList.toggle('hidden', !isAdmin);
        document.getElementById('userFoodSection')?.classList.toggle('hidden', isAdmin);
        document.querySelectorAll('.admin-only').forEach(el => el.classList.toggle('hidden', !isAdmin));

        const orderInput = document.getElementById('dailyOrderInput');
        if (orderInput) orderInput.value = dailyStateManager.getState().orderLink || '';
    }

    static renderDailyBanner() {
        const state = dailyStateManager.getState();
        const linkEl = document.getElementById('dailyOrderLink');
        const pickupEl = document.getElementById('dailyPickupPerson');

        if (linkEl) {
            linkEl.innerHTML = state.orderLink
                ? `<a href="${state.orderLink}" target="_blank" rel="noopener">Mo link order com</a>`
                : 'Admin chua cap nhat link dat com hom nay.';
        }

        if (pickupEl) {
            pickupEl.innerHTML = state.pickupPerson
                ? `
                    <span class="pickup-person">
                        ${state.pickupPerson.avatar ? `<img src="${state.pickupPerson.avatar}" alt="${state.pickupPerson.name}" />` : ''}
                        <span>${state.pickupPerson.name}</span>
                    </span>
                `
                : 'Chua chon nguoi nhan com hom nay.';
        }
    }

    static loginAdmin() {
        const input = document.getElementById('adminPasswordInput');
        try {
            AuthManager.login(input?.value || '');
            if (input) input.value = '';
            this.renderAll();
        } catch (error) {
            alert(error.message);
        }
    }

    static logoutAdmin() {
        AuthManager.logout();
        document.getElementById('adminPanel')?.classList.add('hidden');
        this.renderAll();
    }

    static revealAdminLogin() {
        document.getElementById('adminPanel')?.classList.remove('hidden');
    }

    static saveDailyOrderLink() {
        if (!AuthManager.isAdmin()) return;
        try {
            dailyStateManager.setOrderLink(document.getElementById('dailyOrderInput')?.value || '');
            this.renderDailyBanner();
            alert('Da luu link order com hom nay.');
        } catch (error) {
            alert(error.message);
        }
    }

    static resetDailyState() {
        if (!AuthManager.isAdmin()) return;
        if (!confirm('Reset link order, nguoi nhan com va khao sat hom nay?')) return;
        dailyStateManager.resetToday();
        this.renderAll();
    }

    static storeCard(store, options = {}) {
        const isSelected = storeManager.getSelectedStores().some(s => Number(s.id) === Number(store.id));
        const tagPills = (store.tags || []).map(tag => `<span class="tag-pill">${tag}</span>`).join('');
        const selectLabel = isSelected ? '<div class="selected-label">Da chon</div>' : '';
        const manageActions = options.manage
            ? `<div class="racer-card-actions" onclick="event.stopPropagation()">
                <button class="btn btn-secondary btn-small" onclick="editStore(${store.id})">Edit</button>
                <button class="btn btn-secondary btn-small" onclick="deleteStore(${store.id})">Delete</button>
              </div>`
            : '';
        const click = options.selectable ? `onclick="uiManager.toggleStoreSelection(${store.id})"` : '';
        return `
            <div class="racer-card ${isSelected ? 'selected' : ''}" ${click}>
                <div class="racer-card-avatar">${store.emoji || ''}</div>
                <div class="racer-card-name">${store.name}</div>
                <div class="tag-list">${tagPills}</div>
                <div class="card-stat">${store.wins || 0} win</div>
                ${manageActions}
                ${options.selectable ? selectLabel : ''}
            </div>
        `;
    }

    static renderStoreGrid() {
        const stores = storeManager.getAllStores();
        const empty = '<p class="helper-text">Chua co quan nao.</p>';

        const userGrid = document.getElementById('storeGrid');
        if (userGrid) userGrid.innerHTML = stores.length ? stores.map(store => this.storeCard(store)).join('') : empty;

        const selectGrid = document.getElementById('adminStoreSelectGrid');
        if (selectGrid) selectGrid.innerHTML = stores.length ? stores.map(store => this.storeCard(store, { selectable: true })).join('') : empty;

        const manageGrid = document.getElementById('adminStoreManageGrid');
        if (manageGrid) manageGrid.innerHTML = stores.length ? stores.map(store => this.storeCard(store, { manage: true })).join('') : empty;
    }

    static toggleStoreSelection(id) {
        storeManager.toggleStoreSelection(id);
        currentMode = 'stores';
        this.renderStoreGrid();
        this.updateRaceTrackForStores();
    }

    static async editStore(id) {
        if (!AuthManager.isAdmin()) return;
        const store = storeManager.getStoreById(id);
        if (!store) return;
        const name = prompt('Ten quan:', store.name);
        if (name === null) return;
        const emoji = prompt('Icon quan:', store.emoji || CONFIG.storeEmojis[0]);
        if (emoji === null) return;
        const tagsRaw = prompt('Tags, phan cach bang dau phay:', (store.tags || []).join(', '));
        if (tagsRaw === null) return;
        try {
            await storeManager.updateStore(id, {
                name,
                emoji,
                tags: tagsRaw.split(',').map(tag => tag.trim()).filter(Boolean)
            });
            this.renderStoreGrid();
            this.renderSurveySelect();
            this.renderSurveySummary();
        } catch (error) {
            alert(error.message);
        }
    }

    static async deleteStore(id) {
        if (!AuthManager.isAdmin()) return;
        const store = storeManager.getStoreById(id);
        if (!store || !confirm(`Xoa quan "${store.name}"?`)) return;
        await storeManager.deleteStore(id);
        this.renderStoreGrid();
        this.renderSurveySelect();
        this.renderSurveySummary();
    }

    static initStoreEmojiPicker() {
        const picker = document.getElementById('storeEmojiPicker');
        if (!picker) return;
        picker.innerHTML = CONFIG.storeEmojis.map(emoji =>
            `<div class="avatar-option ${emoji === storeManager.selectedEmoji ? 'selected' : ''}" onclick="selectStoreEmoji('${emoji}')">${emoji}</div>`
        ).join('');
    }

    static selectStoreEmoji(emoji) {
        storeManager.setSelectedEmoji(emoji);
        this.initStoreEmojiPicker();
    }

    static async addStore() {
        if (!AuthManager.isAdmin()) return;
        const nameInput = document.getElementById('newStoreName');
        const tagsInput = document.getElementById('newStoreTags');
        try {
            await storeManager.addStore(
                nameInput?.value || '',
                storeManager.selectedEmoji,
                (tagsInput?.value || '').split(',').map(tag => tag.trim()).filter(Boolean)
            );
            if (nameInput) nameInput.value = '';
            if (tagsInput) tagsInput.value = '';
            storeManager.setSelectedEmoji(CONFIG.storeEmojis[0]);
            this.initStoreEmojiPicker();
            this.renderStoreGrid();
            this.renderSurveySelect();
            this.renderSurveySummary();
        } catch (error) {
            alert(error.message);
        }
    }

    static initRequestEmojiPicker() {
        const picker = document.getElementById('requestStoreEmojiPicker');
        if (!picker) return;
        const selected = this.requestStoreEmoji || CONFIG.storeEmojis[0];
        picker.innerHTML = CONFIG.storeEmojis.map(emoji =>
            `<div class="avatar-option ${emoji === selected ? 'selected' : ''}" onclick="selectRequestStoreEmoji('${emoji}')">${emoji}</div>`
        ).join('');
    }

    static selectRequestStoreEmoji(emoji) {
        this.requestStoreEmoji = emoji;
        this.initRequestEmojiPicker();
    }

    static getStoreRequestFormData() {
        return {
            name: document.getElementById('requestStoreName')?.value || '',
            emoji: this.requestStoreEmoji || CONFIG.storeEmojis[0],
            tags: (document.getElementById('requestStoreTags')?.value || '').split(',').map(tag => tag.trim()).filter(Boolean),
            note: document.getElementById('requestStoreNote')?.value || ''
        };
    }

    static async submitStoreRequest() {
        try {
            const request = await storeRequestManager.addRequest(this.getStoreRequestFormData());
            ['requestStoreName', 'requestStoreTags', 'requestStoreNote'].forEach(id => {
                const input = document.getElementById(id);
                if (input) input.value = '';
            });
            this.requestStoreEmoji = CONFIG.storeEmojis[0];
            this.initRequestEmojiPicker();
            this.renderRequestList();
            this.renderMyRequestList();
            alert(`Da gui request quan "${request.name}".`);
        } catch (error) {
            alert(error.message);
        }
    }

    static renderRequestList() {
        const list = document.getElementById('storeRequestList');
        if (!list) return;
        const pending = storeRequestManager.getPending();
        if (pending.length === 0) {
            list.innerHTML = '<p class="helper-text">Khong co request nao dang cho duyet.</p>';
            return;
        }
        list.innerHTML = pending.map(request => `
            <div class="request-item">
                <div>
                    <strong>${request.emoji || ''} ${request.name}</strong>
                    <div>${(request.tags || []).map(tag => `<span class="tag-pill">${tag}</span>`).join('')}</div>
                    <p class="helper-text">${request.note || 'Khong co ghi chu.'}</p>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary btn-small" onclick="approveStoreRequest(${request.id})">Approve</button>
                    <button class="btn btn-secondary btn-small" onclick="rejectStoreRequest(${request.id})">Reject</button>
                </div>
            </div>
        `).join('');
    }

    static renderMyRequestList() {
        const list = document.getElementById('myStoreRequestList');
        if (!list) return;
        const mine = storeRequestManager.getMine();
        if (mine.length === 0) {
            list.innerHTML = '<p class="helper-text">Session nay chua gui request nao.</p>';
            return;
        }
        list.innerHTML = mine.map(request => `
            <div class="request-item">
                <div>
                    <strong>${request.emoji || ''} ${request.name}</strong>
                    <div>${(request.tags || []).map(tag => `<span class="tag-pill">${tag}</span>`).join('')}</div>
                    <p class="helper-text">${request.status || 'pending'} - ${request.note || 'Khong co ghi chu.'}</p>
                </div>
            </div>
        `).join('');
    }

    static async approveStoreRequest(id) {
        if (!AuthManager.isAdmin()) return;
        try {
            await storeRequestManager.approve(id);
            this.renderStoreGrid();
            this.renderRequestList();
            this.renderSurveySelect();
            this.renderSurveySummary();
        } catch (error) {
            alert(error.message);
        }
    }

    static async rejectStoreRequest(id) {
        if (!AuthManager.isAdmin()) return;
        try {
            await storeRequestManager.reject(id);
            this.renderRequestList();
        } catch (error) {
            alert(error.message);
        }
    }

    static renderSurveySelect() {
        const select = document.getElementById('surveyStoreSelect');
        const hint = document.getElementById('surveyHint');
        if (!select) return;
        const selectedIds = new Set(surveyManager.getSelectedIdsForBrowser());
        const stores = storeManager.getAllStores();
        select.innerHTML = stores.length
            ? stores.map(store => `<option value="${store.id}" ${selectedIds.has(Number(store.id)) ? 'selected' : ''}>${store.emoji || ''} ${store.name}</option>`).join('')
            : '<option value="">Chua co quan nao</option>';
        if (hint) hint.textContent = 'Giu Ctrl/Cmd de chon nhieu quan. Lua chon duoc luu trong session hom nay.';
    }

    static submitDailySurvey() {
        const select = document.getElementById('surveyStoreSelect');
        const ids = Array.from(select?.selectedOptions || []).map(option => option.value).filter(Boolean);
        try {
            const stores = surveyManager.voteMany(ids);
            this.renderSurveySelect();
            this.renderSurveySummary();
            alert(`Da ghi nhan ${stores.length} quan.`);
        } catch (error) {
            alert(error.message);
        }
    }

    static renderSurveySummary() {
        const summaryEl = document.getElementById('surveySummary');
        const recommendedEl = document.getElementById('adminRecommendedStores');
        if (!summaryEl && !recommendedEl) return;

        const summary = surveyManager.summary(true);
        const visible = this.rankingExpanded ? summary : summary.slice(0, 5);
        const html = visible.map((item, index) => `
            <div class="survey-row">
                <span>${index + 1}. ${item.emoji || ''} ${item.storeName}</span>
                <strong>${item.count} vote</strong>
            </div>
        `).join('') || '<p class="helper-text">Chua co quan nao.</p>';

        if (summaryEl) summaryEl.innerHTML = html;
        if (recommendedEl) recommendedEl.innerHTML = html;

        const loadMore = document.getElementById('rankingLoadMoreBtn');
        if (loadMore) {
            loadMore.classList.toggle('hidden', summary.length <= 5);
            loadMore.textContent = this.rankingExpanded ? 'Thu gon' : 'Xem them';
        }
    }

    static toggleRankingFull() {
        this.rankingExpanded = !this.rankingExpanded;
        this.renderSurveySummary();
    }

    static resetDailySurvey() {
        if (!AuthManager.isAdmin()) return;
        surveyManager.resetForToday();
        this.renderSurveySelect();
        this.renderSurveySummary();
    }

    static renderRacerGrid() {
        const grid = document.getElementById('racerGrid');
        if (!grid) return;
        const racers = dataManager.getAllRacers();
        if (racers.length === 0) {
            grid.innerHTML = '<p class="helper-text">Chua co runner nao.</p>';
            return;
        }

        grid.innerHTML = racers.map(racer => {
            const isSelected = dataManager.getSelectedRacers().some(r => Number(r.id) === Number(racer.id));
            return `
                <div class="racer-card ${isSelected ? 'selected' : ''}" onclick="uiManager.toggleRacerSelection(${racer.id})">
                    <div class="racer-card-avatar"><img src="${racer.avatar}" alt="${racer.name}" /></div>
                    <div class="racer-card-name">${racer.name}</div>
                    <div class="card-stat">${racer.wins || 0} win</div>
                    ${isSelected ? '<div class="selected-label">Da chon</div>' : ''}
                </div>
            `;
        }).join('');
    }

    static toggleRacerSelection(id) {
        if (!AuthManager.isAdmin()) return;
        currentMode = 'people';
        dataManager.toggleRacerSelection(id);
        this.renderRacerGrid();
        this.updateRaceTrack();
    }

    static async addRacer() {
        if (!AuthManager.isAdmin()) return;
        try {
            const nameInput = document.getElementById('newRacerName');
            const avatarInput = document.getElementById('newRacerAvatar');
            await dataManager.addRacer(nameInput?.value || '', avatarInput?.value || '');
            if (nameInput) nameInput.value = '';
            if (avatarInput) avatarInput.value = '';
            this.renderRacerGrid();
        } catch (error) {
            alert(error.message);
        }
    }

    static async openRunnerJsonFile() {
        if (!AuthManager.isAdmin()) return;
        try {
            await dataManager.openRunnerFile();
            this.renderRacerGrid();
            const status = document.getElementById('runnerFileStatus');
            if (status) status.textContent = 'Da mo runner.json. Them runner va win count se ghi vao file nay.';
        } catch (error) {
            alert(error.message);
        }
    }

    static updateRaceTrack() {
        const lanes = document.querySelector(CONFIG.selectors.lanes);
        const emptyState = document.querySelector(CONFIG.selectors.emptyState);
        if (!lanes || !emptyState) return;
        lanes.innerHTML = '';
        const selectedRacers = dataManager.getSelectedRacers();
        if (selectedRacers.length === 0) {
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
                    <span class="speed-lines">&gt;&gt;&gt;&gt;</span>
                </div>
            </div>
        `).join('');
        this.checkSpritesheet();
    }

    static updateRaceTrackForStores() {
        const lanes = document.getElementById('storeLanes');
        const emptyState = document.getElementById('storeEmptyState');
        if (!lanes || !emptyState) return;

        lanes.innerHTML = '';
        const selectedStores = storeManager.getSelectedStores();
        if (selectedStores.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        lanes.innerHTML = selectedStores.map(store => `
            <div class="lane">
                <div class="racer" data-racer-id="${store.id}">
                    <div class="racer-avatar">${store.emoji || ''}</div>
                    <div class="racer-name">${store.name}</div>
                    <span class="speed-lines">&gt;&gt;&gt;&gt;</span>
                </div>
            </div>
        `).join('');
    }

    static startStoreRace() {
        if (!AuthManager.isAdmin()) return;
        currentMode = 'stores';
        this.updateRaceTrackForStores();
        startRace();
    }

    static checkSpritesheet() {
        const img = new Image();
        img.onerror = () => {
            document.querySelectorAll('.sprite-runner').forEach(el => el.classList.add('fallback-emoji'));
        };
        img.src = CONFIG.sprite.sheetPath;
    }

    static showWinnerModal(winner, type = 'racer') {
        const modal = document.querySelector(CONFIG.selectors.winnerModal);
        const avatarEl = document.querySelector(CONFIG.selectors.winnerAvatar);
        const nameEl = document.querySelector(CONFIG.selectors.winnerName);
        const tagsEl = document.querySelector(CONFIG.selectors.winnerTags);
        const msgEl = document.getElementById('winnerMessage');
        const titleEl = document.getElementById('winnerTitle');
        const secBtn = document.getElementById('winnerSecondaryBtn');
        if (!modal || !avatarEl || !nameEl) return;

        if (type === 'store') {
            avatarEl.innerHTML = winner.emoji || '';
            nameEl.textContent = winner.name;
            if (titleEl) titleEl.textContent = 'QUAN THANG CUOC';
            if (msgEl) msgEl.textContent = 'Quan nay thang roi.';
            if (secBtn) {
                secBtn.textContent = 'Dong';
                secBtn.onclick = () => closeWinnerModal();
            }
            if (tagsEl) tagsEl.innerHTML = (winner.tags || []).map(t => `<span class="tag-pill">${t}</span>`).join('');
        } else {
            avatarEl.innerHTML = `<img src="${winner.avatar}" alt="${winner.name}" />`;
            nameEl.textContent = winner.name;
            if (titleEl) titleEl.textContent = 'NGUOI NHAN COM HOM NAY';
            if (msgEl) msgEl.textContent = 'Hom nay ban la nguoi nhan com.';
            if (secBtn) {
                secBtn.textContent = 'Chon nguoi khac';
                secBtn.onclick = () => closeWinnerModal();
            }
            if (tagsEl) tagsEl.innerHTML = '';
        }

        modal.style.display = 'flex';
        this.createConfetti();
    }

    static closeWinnerModal() {
        const modal = document.querySelector(CONFIG.selectors.winnerModal);
        if (modal) modal.style.display = 'none';
    }

    static createConfetti() {
        const { count, colors, duration, delay } = CONFIG.confetti;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), duration);
            }, i * delay);
        }
    }

    static async openStoreJsonFile() {
        if (!AuthManager.isAdmin()) return;
        try {
            await storeManager.openStoreFile();
            this.renderStoreGrid();
            this.renderSurveySelect();
            this.renderSurveySummary();
            const status = document.getElementById('storeFileStatus');
            if (status) status.textContent = 'Da mo quan-an.json. Them/sua/xoa/approve se ghi vao file nay.';
        } catch (error) {
            alert(error.message);
        }
    }

    static async openStoreRequestFile() {
        try {
            await storeRequestManager.openRequestsFile();
            this.renderRequestList();
            alert('Da mo file request JSON.');
        } catch (error) {
            alert(error.message);
        }
    }

    static exportData() {
        this.downloadJson(dataManager.exportToJSON(), `runner-${Date.now()}.json`);
    }

    static importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                dataManager.importFromJSON(JSON.parse(e.target.result));
                this.renderRacerGrid();
                this.updateRaceTrack();
            } catch (error) {
                alert(error.message);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    static exportStoreData() {
        this.downloadJson(storeManager.exportToJSON(), `quan-an-${Date.now()}.json`);
    }

    static importStoreData(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                storeManager.importFromJSON(JSON.parse(e.target.result));
                this.renderStoreGrid();
                this.renderSurveySelect();
                this.renderSurveySummary();
            } catch (error) {
                alert(error.message);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    static downloadJson(jsonStr, filename) {
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    static applySettings(data) {
        if (data?.confetti) CONFIG.confetti = Object.assign({}, CONFIG.confetti, data.confetti);
    }
}

const uiManager = UIManager;
window.UIManager = UIManager;

function showPanelTab(sectionId, paneId) { uiManager.showPanelTab(sectionId, paneId); }
function switchMode(mode) { uiManager.switchMode(mode); }
function toggleStoreManagement() {}
function toggleManagement() { uiManager.toggleManagement(); }
function addStore() { uiManager.addStore(); }
function exportStoreData() { uiManager.exportStoreData(); }
function importStoreData(event) { uiManager.importStoreData(event); }
function selectStoreEmoji(emoji) { uiManager.selectStoreEmoji(emoji); }
function editStore(id) { uiManager.editStore(id); }
function deleteStore(id) { uiManager.deleteStore(id); }
function toggleStoreSelection(id) { uiManager.toggleStoreSelection(id); }
function startStoreRace() { uiManager.startStoreRace(); }
function loginAdmin() { uiManager.loginAdmin(); }
function logoutAdmin() { uiManager.logoutAdmin(); }
function revealAdminLogin() { uiManager.revealAdminLogin(); }
function saveDailyOrderLink() { uiManager.saveDailyOrderLink(); }
function resetDailyState() { uiManager.resetDailyState(); }
function openStoreJsonFile() { uiManager.openStoreJsonFile(); }
function openStoreRequestFile() { uiManager.openStoreRequestFile(); }
function selectRequestStoreEmoji(emoji) { uiManager.selectRequestStoreEmoji(emoji); }
function submitStoreRequest() { uiManager.submitStoreRequest(); }
function approveStoreRequest(id) { uiManager.approveStoreRequest(id); }
function rejectStoreRequest(id) { uiManager.rejectStoreRequest(id); }
function submitDailySurvey() { uiManager.submitDailySurvey(); }
function toggleRankingFull() { uiManager.toggleRankingFull(); }
function resetDailySurvey() { uiManager.resetDailySurvey(); }
function addRacer() { uiManager.addRacer(); }
function openRunnerJsonFile() { uiManager.openRunnerJsonFile(); }
function exportData() { uiManager.exportData(); }
function importData(event) { uiManager.importData(event); }
