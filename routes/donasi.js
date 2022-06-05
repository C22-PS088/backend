var express = require('express');
const Multer = require('multer');
var router = express.Router();

const {
  getAllDonasi,
  getDonasiById,
  addDonasi,
  updateDonasi,
  deleteDonasi
} = require('../controllers/Donasi');

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.get('/', getAllDonasi);
router.get('/:id', getDonasiById);
router.post('/', multer.fields([{ name: 'logo', maxCount: 1 }, { name: 'gambar', maxCount: 1 }]), addDonasi);
router.put('/:id', multer.fields([{ name: 'logo', maxCount: 1 }, { name: 'gambar', maxCount: 1 }]), updateDonasi);
router.delete('/:id', deleteDonasi);

module.exports = router;
