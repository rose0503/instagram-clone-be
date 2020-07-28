const express = require('express');
const router = express.Router();

const controller = require('../controllers/post.controller');
const requireLogin = require("../middlewares/requireLogin");

router.get('/allpost', requireLogin, controller.allPost); 

router.post('/createpost', requireLogin , controller.createPost);

router.get('/mypost', requireLogin , controller.myPost);  

router.get('/getsubpost', requireLogin , controller.getsubpost);  

router.put('/like', requireLogin , controller.like);  

router.put('/unlike', requireLogin , controller.unlike); 

router.put('/comment', requireLogin , controller.comment); 

router.delete('/deletepost/:postId', requireLogin , controller.deletepost); 

module.exports = router;