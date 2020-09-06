const mongoose = require('mongoose');
const Post = require('../models/post.model');

module.exports.createPost = (req, res) => {
    const {title, body, pic} = req.body;
    if(!title || !body || !pic){
        return res.status(422).json({error: "Vui lòng điền thông tin đầy đủ!"});
    }
    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        photo: pic,
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
     .populate('postedBy', "_id name createdAt pic")
     .populate('comments.postedBy', "_id name createdAt pic")
     .sort("-createdAt")
     .then(posts => {
         res.json({posts});
     })
     .catch(err => {
         console.log(err);
     })
};

module.exports.getsubpost = (req, res) => {
    Post.find({postedBy:{$in:req.user.following}})
     .populate('postedBy', "_id name pic createdAt")
     .populate('comments.postedBy', "_id name pic createdAt")
     .sort("-createdAt")
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

module.exports.like = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId,{
        $push: {likes:req.user._id}, 
    },{
        new: true
    })
    .populate("comments.postedBy", "_id name pic createdAt")
    .populate("postedBy", "_id name pic createdAt")
    .exec((err, result)=>{
        if(err){
            return res.status(422).json({error: err});
        }else{
            res.json(result)
        }
    })
    
}

module.exports.unlike = ((req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("comments.postedBy", "_id name pic createdAt")
    .populate("postedBy", "_id name pic createdAt")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
    
     
})

module.exports.comment = ((req,res)=>{
    const comment ={
        text: req.body.text,
        postedBy: req.user._id,
        date: Date.now()
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy", "_id name pic createdAt")
    .populate("postedBy", "_id name pic createdAt")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            
            res.json(result)
        }
    })
     
})


module.exports.deletepost = (req, res) => {
    Post.findOne({_id:req.params.postId})
    .populate("postedBy", "_id")
    .exec((err, post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result => {
                res.json(result)
            }).catch(err => {
                console.log(err)
            })
        }
    })
}