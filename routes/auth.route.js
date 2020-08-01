const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth.controller');
const requireLogin = require('../middlewares/requireLogin');

router.get('/protected', requireLogin, (req, res) => {
    res.render('Hello hello');
})

router.post('/signup', controller.signup);

router.post('/signin', controller.signin)

router.post('/reset-password', controller.resetpassword)

router.post('/new-password', controller.newpassword)

module.exports = router;