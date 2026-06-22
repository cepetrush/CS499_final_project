var express = require('express');
var router = express.Router();
var controller = require('../controllers/pet');

/* GET pet page */
router.get('/', controller.pet);

module.exports = router;