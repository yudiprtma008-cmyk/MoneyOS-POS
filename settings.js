const Settings = {
    save: (data) => {
        const tx = db.transaction('settings', 'readwrite');
        tx.objectStore('settings').put({ id: 'config', ...data });
    },
    get: () => {
        return new Promise((resolve) => {
            const req = db.transaction('settings').objectStore('settings').get('config');
            req.onsuccess = () => resolve(req.result || {});
        });
    }
};
