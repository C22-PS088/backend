var express = require('express');
var router = express.Router();

const {
  getAllSatwa,
  getSatwaById,
  getSatwaByIdV2,
  addSatwa,
  updateSatwa,
  deleteSatwa
} = require('../controllers/Satwa');

router.get('/', getAllSatwa);
router.get('/:id', getSatwaById);
router.get('/v2/:id', getSatwaByIdV2);
router.post('/', addSatwa);
router.put('/:id', updateSatwa);
router.delete('/:id', deleteSatwa);

module.exports = router;
