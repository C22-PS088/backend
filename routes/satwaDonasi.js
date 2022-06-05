var express = require('express');
var router = express.Router();

const {
  getAllSatwaDonasi,
  getSatwaDonasiById,
  getSatwaDonasiBySatwa,
  getSatwaDonasiBySatwaV2,
  getSatwaDonasiByDonasi,
  addSatwaDonasi,
  updateSatwaDonasi,
  deleteSatwaDonasi
} = require('../controllers/SatwaDonasi');

router.get('/', getAllSatwaDonasi);
router.get('/:id', getSatwaDonasiById);
router.get('/satwa/:id', getSatwaDonasiBySatwa);
router.get('/v2/satwa/:id', getSatwaDonasiBySatwaV2);
router.get('/donasi/:id', getSatwaDonasiByDonasi);
router.post('/', addSatwaDonasi);
router.put('/:id', updateSatwaDonasi);
router.delete('/:id', deleteSatwaDonasi);

module.exports = router;
