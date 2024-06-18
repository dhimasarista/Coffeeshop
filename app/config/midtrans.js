const { Snap } = require('midtrans-client');
const snap = new Snap({
    isProduction: false,
    serverKey: 'SB-Mid-server-zTZ2r8AhWDPPeBo7H8bWtssm', 
    clientKey: 'SB-Mid-client-pZ40T3iL913MGQy1' 
});

module.exports = snap;