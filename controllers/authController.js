const User = require('../models/userModel')
const catchAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken')
const AppError = require("../utils/appError")

const signToken=id=>{
   return jwt.sign({id},'secret',{
        expiresIn:'90d'
    })
}
exports.signup=catchAsync(async(req,res,next)=>{
    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword,
    });

    const token = signToken(newUser._id)


    res.status(201).json({
       status:'success',
       token,
        data:{
           user: newUser
        }
    })
});

exports.login=catchAsync(async(req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return next(new AppError('please provide email and password',400))
    }

    const user = await User.findOne({email});

    if(!user || !(await user.isCorrectPassword(password,user.password))){
        return next(new AppError('provide valid user and password',401))
    }

const token =signToken(user._id)
    res.status(200).json({
        status:'success',
        token
    })
})