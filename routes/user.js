var express = require('express');
var router = express.Router();

const { verifyToken } = require('../middleware/VerifyToken');

const { getUsers } = require('../controllers/User');

router.get('/', verifyToken, getUsers);

module.exports = router;
