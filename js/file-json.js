/**
 * File System Access API helpers with localStorage fallback.
 */
const JsonFileManager = {
    isSupported() {
        return typeof window.showOpenFilePicker === 'function';
    },

    async openJsonFile() {
        if (!this.isSupported()) {
            throw new Error('Trinh duyet nay chua ho tro ghi file JSON truc tiep. Hay dung Chrome/Edge desktop hoac fallback import/export.');
        }
        const [handle] = await window.showOpenFilePicker({
            multiple: false,
            types: [{
                description: 'JSON files',
                accept: { 'application/json': ['.json'] }
            }]
        });
        return handle;
    },

    async read(handle) {
        const file = await handle.getFile();
        const text = await file.text();
        return text.trim() ? JSON.parse(text) : {};
    },

    async write(handle, data) {
        const writable = await handle.createWritable();
        await writable.write(JSON.stringify(data, null, 2));
        await writable.close();
    }
};

