var express = require('express');
var router = express.Router();

const {
  getAllSatwa,
  getSatwaById,
  addSatwa,
  updateSatwa,
  deleteSatwa
} = require('../controllers/Satwa');

router.get('/', getAllSatwa);
router.get('/:id', getSatwaById);
router.post('/', addSatwa);
router.put('/:id', updateSatwa);
router.delete('/:id', deleteSatwa);

module.exports = router;
