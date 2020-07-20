const express = require('express');
const router = express.Router();

const controller = require('../controllers/post.controller');
const requireLogin = require("../middlewares/requireLogin");

router.get('/allpost', controller.allPost); 

router.post('/createpost', requireLogin , controller.createPost);

router.get('/mypost', requireLogin , controller.myPost);

module.exports = router;