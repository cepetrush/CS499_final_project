var express = require('express');
var router = express.Router();
const ctrlMain = require('../controllers/main');

const authController = require('../../app_api/controllers/authentication');

/* GET home page. */
router.get('/', ctrlMain.index);

router
    .route('/login')
    .post(authController.login);

router
    .route('/register')
    .post(authController.register);

router.route('/verify').post(authController.token_login);

module.exports = router;
