const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../keys");
const User = require('../models/user.model')

module.exports = async (req, res, next) => {
    const  {authorization} = req.headers;
     //authorization = Bearer eeeeeeefsfaeda
    if(!authorization){
        return res.status(401).json({error: "Bạn phải đăng nhập"})
    }
    const token = authorization.replace("Bearer ","");
    await jwt.verify(token, JWT_SECRET ,(err, payload) => {
        if(err){
            return res.status(401).json({err: "Bạn phải đăng nhập"});
        }

        const {_id} = payload;
        User.findById(_id).then((userdata) => {
            req.user = userdata;
            next();            
        })
    })
}