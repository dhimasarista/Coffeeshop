const { Snap } = require('midtrans-client');

// Atur konfigurasi Snap Midtrans
const snap = new Snap({
    isProduction: false, // Ganti menjadi true saat siap untuk production
    serverKey: 'SB-Mid-server-zTZ2r8AhWDPPeBo7H8bWtssm', // Server Key dari Midtrans
    clientKey: 'SB-Mid-client-pZ40T3iL913MGQy1' // Client Key dari Midtrans
});

module.exports = snap;