var express = require('express');
var router = express.Router();

const {
  getTransaksi,
  getTransaksiByEmail,
  getTransaksiStatus,
  addTransaksi,
  notifHandler
} = require('../controllers/Transaksi');

router.get('/', getTransaksi);
router.get('/email/:email', getTransaksiByEmail);
router.get('/status/:id', getTransaksiStatus);
router.post('/', addTransaksi);
router.post('/notif', notifHandler);

module.exports = router;
