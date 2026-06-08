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
let cart = [];

// Menambah produk ke keranjang
function addToCart(id) {
    const tx = db.transaction('products', 'readonly');
    const request = tx.objectStore('products').get(id);
    request.onsuccess = () => {
        const p = request.result;
        const exist = cart.find(i => i.id === p.id);
        if (exist) exist.qty++;
        else cart.push({ ...p, qty: 1 });
        renderKasir(); // Update UI Kasir
    };
}

// Menghitung Total
function getTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

// Proses Pembayaran
async function checkout() {
    if (cart.length === 0) return alert('Keranjang kosong!');
    
    const transaction = {
        id: Date.now(),
        items: cart,
        total: getTotal(),
        date: new Date().toISOString()
    };

    const tx = db.transaction('transactions', 'readwrite');
    tx.objectStore('transactions').add(transaction);
    
    tx.oncomplete = () => {
        Receipt.print(transaction);
        cart = []; // Reset Keranjang
        router('kasir');
    };
}
