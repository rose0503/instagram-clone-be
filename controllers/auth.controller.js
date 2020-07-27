const mongoose = require('mongoose');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../keys');


module.exports.signup = async (req, res) => {
    const {name, email, password} = req.body;
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
                name
            })
            user.save()
             .then(user => {
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
                        const {_id, email, password,name} = savedUser;
                        res.json({token, user:{_id, email, password, name}});
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
