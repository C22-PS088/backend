var express = require('express');
const Multer = require('multer');
var router = express.Router();

const {
  getAllSatwa,
  getSatwaById,
  getSatwaByIdV2,
  addSatwa,
  updateSatwa,
  deleteSatwa
} = require('../controllers/Satwa');

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.get('/', getAllSatwa);
router.get('/:id', getSatwaById);
router.get('/v2/:id', getSatwaByIdV2);
router.post('/', multer.single('gambar_lokasi'), addSatwa);
router.put('/:id', multer.single('gambar_lokasi'), updateSatwa);
router.delete('/:id', deleteSatwa);

module.exports = router;
