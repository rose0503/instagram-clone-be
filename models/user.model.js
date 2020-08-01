const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required:  true
    },
    resetToken: String,
    expireToken: Date,
    pic:{
        type: String,
        default: "https://res.cloudinary.com/quocviet0503/image/upload/v1595881667/default-avatar_haphbj.png"
    },
    followers: [{type: ObjectId, ref: "User"}],
    following: [{type: ObjectId, ref: "User"}]
})
var User = mongoose.model("User", userSchema);
module.exports = User;