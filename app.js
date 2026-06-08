const UI = {
    render: (content) => document.getElementById('app').innerHTML = content,
    toast: (msg) => alert(msg) // Bisa diganti custom modal
};

async function loadProducts() {
    const tx = db.transaction('products', 'readonly');
    const store = tx.objectStore('products');
    const request = store.getAll();
    request.onsuccess = () => {
        const list = request.result.map(p => `
            <div class="item-card">
                <div><strong>${p.name}</strong><br><small>Rp ${p.price}</small></div>
                <button onclick="addToCart(${p.id})">+</button>
            </div>`).join('');
        document.getElementById('product-list').innerHTML = list;
    };
}

function saveProduct() {
    const product = {
        id: Date.now(),
        name: document.getElementById('p-name').value,
        price: parseFloat(document.getElementById('p-price').value),
        stock: parseInt(document.getElementById('p-stock').value)
    };
    
    const tx = db.transaction('products', 'readwrite');
    tx.objectStore('products').add(product);
    tx.oncomplete = () => {
        UI.toast('Produk Berhasil Ditambahkan');
        router('produk');
    };
}
