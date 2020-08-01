const mongoose = require('mongoose');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const {JWT_SECRET, SENDGRID_API, EMAIL_URL} = require('../config/keys');
var nodemailer = require('nodemailer');
var sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key: SENDGRID_API 
    }
}))

module.exports.signup = async (req, res) => {
    const {name, email, password,pic} = req.body;
    if(!name || !password || !email){
       return res.status(422).json({err:"Vui lòng điền đầy đủ thông tin!"});
    }
    await User.findOne({email})
     .then((saveUser) => {
         if(saveUser){
             return res.status(422).json({err:"Email đã tồn tại"});
         }
         
         bcrypt.hash(password, 12)
          .then(hashedpassword => {
            const user = new User({
                email,
                password: hashedpassword, 
                name,
                pic
            })
            user.save()
             .then(user => {
                transporter.sendMail({
                    to: `${user.email}`,
                    from: "tqviet.0503@gmail.com",
                    subject: "[INSTAGRAM] Đăng ký thành công tài khoản Instagram",
                    html: "<h1>Chào mừng đến với Instagram</h1>"
                })
                res.json({messenge: "Đăng ký thành công"});
             })
             .catch(err => {
                console.log(err);
             })
          })
         
     })
     .catch(err => {
         console.log(err);
     })
}


module.exports.signin = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.json({error: "Vui lòng nhập email và password!"})
    }
    await User.findOne({email})
            .then((savedUser) => {
                if(!savedUser){
                    return res.status(422).json({error: "email và password không đúng"})
                }
                bcrypt.compare(password, savedUser.password)
                 .then(doMatch => {
                     if(doMatch){
                        //  res.json({messenge: "Đăng nhập thành công"});
                        const token = jwt.sign({_id: savedUser._id}, JWT_SECRET);
                        const {_id, email,name, followers, following,pic} = savedUser;
                        res.json({token, user:{_id, email, name, followers, following,pic}});
                     }
                     else{ 
                         return res.status(422).json({error: "email và password không đúng"});
                     }
                 })
            })
            .catch(err => {
                console.log(err)
            })
}


module.exports.resetpassword = async (req, res ) =>{
    crypto.randomBytes(32, (err, buffer) =>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex");
        User.findOne({email:req.body.email})
         .then(user=>{
             if(!user){
                 return res.status(422).json({error: "Tài khoản có email không tồn tại!"})
             }
             user.resetToken = token;
             user.expireToken = Date.now() + 3600000;
             user.save().then(result=>{
                 transporter.sendMail({
                     to:user.email,
                     from: "tqviet.0503@gmail.com",
                     subject: "[INSTAGRAM] RESET PASSWORD",
                     html: `
                     <p>Bạn yêu cầu reset mật khẩu</p>
                     <h5>Bấm vào đường <a href="${EMAIL_URL}/reset/${token}">Link</a> để reset mật khẩu</h5>
                     `
                 }).catch(err=>{console.log(err)})
                 res.json({message: "Check your email"})
             })
         })
    })
}

module.exports.newpassword = async (req, res) =>{
    const newpssword = req.body.password;
    const sentToken = req.body.token;
    User.findOne({resetToken:sentToken, expireToken:{$gt:Date.now()}})
     .then(user=>{
         if(!user){
             return res.status(422).json({error: "Try again session expired!"})
         }
         bcrypt.hash(newpssword, 12)
         .then(hashedpassword =>{
             user.password = hashedpassword
             user.resetToken = undefined
             user.expireToken = undefined
             user.save().then((saveUser)=>{
                 res.json({message: "Cập nhật password thành công"})
             })
         })
     }).catch(err=>
        console.log(err))
}