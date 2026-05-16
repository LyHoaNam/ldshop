/**
 * Tiny admin auth for an internal static app.
 * The password is intentionally hardcoded per project constraints.
 */
const AuthManager = {
    login(password) {
        if (password !== CONFIG.admin.password) {
            throw new Error('Mat khau admin khong dung.');
        }
        sessionStorage.setItem(CONFIG.storage.adminSession, JSON.stringify({
            isAdmin: true,
            loggedInAt: new Date().toISOString()
        }));
        return true;
    },

    logout() {
        sessionStorage.removeItem(CONFIG.storage.adminSession);
    },

    isAdmin() {
        try {
            const raw = sessionStorage.getItem(CONFIG.storage.adminSession);
            return raw ? JSON.parse(raw).isAdmin === true : false;
        } catch (error) {
            sessionStorage.removeItem(CONFIG.storage.adminSession);
            return false;
        }
    }
};

