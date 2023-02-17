const mavlink = require('node-mavlink');

const mav = new mavlink(1, 1, 'v1.0', ['common']);
mav.sendMessge();