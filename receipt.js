const Receipt = {
    print: async (tx) => {
        const settings = await Settings.get(); // Ambil dari IndexedDB
        const win = window.open('', '_blank');
        win.document.write(`
            <style>
                body { width: 58mm; font-family: 'Courier New', monospace; font-size: 10px; margin: 0; }
                .center { text-align: center; }
                .border { border-top: 1px dashed #000; margin: 5px 0; }
            </style>
            <div class="center">
                <h3>${settings.name || 'TOKO ANDA'}</h3>
                <p>${settings.alamat || 'Alamat Toko'}</p>
            </div>
            <div class="border"></div>
            ${tx.items.map(i => `<div>${i.name} x ${i.qty} <span style="float:right">${(i.price * i.qty).toLocaleString()}</span></div>`).join('')}
            <div class="border"></div>
            <div style="font-size: 14px; font-weight: bold;">TOTAL: ${tx.total.toLocaleString()}</div>
            <div class="center" style="margin-top:20px;">Terima Kasih</div>
        `);
        win.document.close();
        win.print();
    }
};
