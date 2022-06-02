var express = require('express');
const Multer = require('multer');
var router = express.Router();

const {
  getAllSatwaGambar,
  getSatwaGambarById,
  getSatwaGambarBySatwa,
  addSatwaGambar,
  deleteSatwaGambar
} = require('../controllers/SatwaGambar');

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.get('/', getAllSatwaGambar);
router.get('/:id', getSatwaGambarById);
router.get('/satwa/:id', getSatwaGambarBySatwa);
router.post('/', multer.single('gambar'), addSatwaGambar);
router.delete('/:id', deleteSatwaGambar);

module.exports = router;
