let db;
const request = indexedDB.open('MoneyOSDB', 1);

request.onupgradeneeded = e => {
    db = e.target.result;
    if(!db.objectStoreNames.contains('products')) db.createObjectStore('products', { keyPath: 'id' });
    if(!db.objectStoreNames.contains('transactions')) db.createObjectStore('transactions', { keyPath: 'id' });
};

request.onsuccess = e => { db = e.target.result; };
