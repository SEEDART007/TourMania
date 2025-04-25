const User = require('../models/userModel')
const catchAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken')


exports.signup=catchAsync(async(req,res,next)=>{
    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword,
    });

    const token = jwt.sign({id:newUser._id},'secret',{
        expiresIn:'90d'
    })


    res.status(201).json({
       status:'success',
       token,
        data:{
           user: newUser
        }
    })
});