const User = require('../models/userModel')
const {promisify}= require('util')
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
        changedPasswordAt:req.body.changedPasswordAt
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

exports.protect = catchAsync(async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
          token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new AppError('You are not logged in',401));
    }
    try{
        const decoded = await promisify(jwt.verify)(token,'secret');
        const user = await User.findById(decoded.id)
        if(!user){
            return next(new AppError('No user found!!',404))
        }
        if(user.changedPasswordAfter(decoded.iat)){
            return next(new AppError('User recently changed password!!login again',401))
        }

        req.user = user;
        next()

    }catch(e){
        if(e.name==='JsonWebTokenError'){
            return next(new AppError('Invalid Token!!',401));
        }else if(e.name==='TokenExpiredError'){
            return next(new AppError('Token Expired!!',401));
        }
    }
    
   
})