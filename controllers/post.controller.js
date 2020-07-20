const mongoose = require('mongoose');
const Post = require('../models/post.model');

module.exports.createPost = (req, res) => {
    const {title, body} = req.body;
    if(!title || !body){
        return res.status(422).json({err: "Vui lòng điền tiêu đề và nội dung!"});
    }
    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        postedBy: req.user
    })
    post.save().then(result => {
        res.json({post: result});
    })
     .catch(err =>{
         console.log(err); 
     })
};

module.exports.allPost = (req, res) => {
    Post.find()
     .populate('postedBy', "_id name")
     .then(posts => {
         res.json({posts});
     })
     .catch(err => {
         console.log(err);
     })
};

module.exports.myPost = (req, res) => {
    Post.find({postedBy: req.user._id})
     .populate('postedBy', "_id name")
     .then(mypost => {
         res.json({mypost});
     })
     .catch(err => {
         console.log(err);
     })
}