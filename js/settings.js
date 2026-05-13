// SettingsManager: load/save app settings and apply to CONFIG
const SettingsManager = (function(){
    const storageKey = CONFIG.storage.appConfig || 'appConfig';

    function loadRaw(){
        try{
            const raw = localStorage.getItem(storageKey);
            return raw ? JSON.parse(raw) : null;
        }catch(e){
            console.error('Failed to parse appConfig', e);
            return null;
        }
    }

    function saveRaw(obj){
        localStorage.setItem(storageKey, JSON.stringify(obj));
    }

    function mergeIntoConfig(overrides){
        if(!overrides) return;
        if(overrides.race) Object.assign(CONFIG.race, overrides.race);
        if(overrides.confetti) Object.assign(CONFIG.confetti, overrides.confetti);
        if(overrides.ui){
            if(typeof overrides.ui.minRacers === 'number') CONFIG.race.minRacers = overrides.ui.minRacers;
            if(typeof overrides.ui.maxRacers === 'number') CONFIG.race.maxRacers = overrides.ui.maxRacers;
        }
    }

    function load(){
        const raw = loadRaw();
        if(raw) mergeIntoConfig(raw);
        return raw || {};
    }

    function reset(){
        saveRaw(CONFIG.DEFAULTS);
        mergeIntoConfig(CONFIG.DEFAULTS);
        populateForm();
    }

    // UI helpers
    function populateForm(){
        const s = loadRaw() || CONFIG.DEFAULTS;
        // race
        document.getElementById('setting_race_baseSpeed').value = s.race.baseSpeed;
        document.getElementById('setting_race_speedVariation').value = s.race.speedVariation;
        document.getElementById('setting_race_animationSpeed').value = s.race.animationSpeed;
        // confetti
        document.getElementById('setting_confetti_count').value = s.confetti.count;
        document.getElementById('setting_confetti_duration').value = s.confetti.duration;
    }

    function readForm(){
        const out = { race: {}, confetti: {}, ui: {} };
        out.race.baseSpeed = Number(document.getElementById('setting_race_baseSpeed').value) || CONFIG.DEFAULTS.race.baseSpeed;
        out.race.speedVariation = Number(document.getElementById('setting_race_speedVariation').value) || CONFIG.DEFAULTS.race.speedVariation;
        out.race.animationSpeed = Number(document.getElementById('setting_race_animationSpeed').value) || CONFIG.DEFAULTS.race.animationSpeed;
        out.confetti.count = Number(document.getElementById('setting_confetti_count').value) || CONFIG.DEFAULTS.confetti.count;
        out.confetti.duration = Number(document.getElementById('setting_confetti_duration').value) || CONFIG.DEFAULTS.confetti.duration;
        return out;
    }

    function applyAndSave(){
        const data = readForm();
        saveRaw(data);
        mergeIntoConfig(data);
        // notify modules that might need to refresh
        if(window.UIManager && typeof window.UIManager.applySettings === 'function'){
            window.UIManager.applySettings(data);
        }
        if(window.RaceEngine && typeof window.RaceEngine.updateSettings === 'function'){
            window.RaceEngine.updateSettings(data);
        }
    }

    function initUi(){
        const openBtn = document.getElementById('openSettingsBtn');
        const modal = document.getElementById('settingsModal');
        const closeBtn = document.getElementById('closeSettingsBtn');
        const saveBtn = document.getElementById('saveSettingsBtn');
        const resetBtn = document.getElementById('resetSettingsBtn');
        if(openBtn) openBtn.addEventListener('click', openSettingsModal);
        if(closeBtn) closeBtn.addEventListener('click', closeSettingsModal);
        if(saveBtn) saveBtn.addEventListener('click', ()=>{ applyAndSave(); closeSettingsModal(); });
        if(resetBtn) resetBtn.addEventListener('click', ()=>{ reset(); });

        modal.addEventListener('click', (e)=>{ if(e.target === modal) closeSettingsModal(); });
    }

    // exported UI functions
    window.openSettingsModal = function(){
        const modal = document.getElementById('settingsModal');
        if(!modal) return;
        populateForm();
        modal.classList.remove('hidden');
    };
    window.closeSettingsModal = function(){
        const modal = document.getElementById('settingsModal');
        if(!modal) return;
        modal.classList.add('hidden');
    };

    return {
        init(){ load(); initUi(); },
        load, saveRaw, reset, applyAndSave
    };
})();

// Auto-init when script loads so app can call SettingsManager if needed
try{ if(document.readyState === 'complete' || document.readyState === 'interactive') SettingsManager.init(); else window.addEventListener('DOMContentLoaded', ()=>SettingsManager.init()); }catch(e){ console.error(e); }
