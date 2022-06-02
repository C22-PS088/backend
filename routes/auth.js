var express = require('express');
var router = express.Router();

const {
  Login,
  Logout,
  refreshToken
} = require('../controllers/Auth');

router.post('/login', Login);
router.delete('/logout', Logout);
router.get('/token', refreshToken);

module.exports = router;
