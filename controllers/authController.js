const User = require('../models/userModel')
const crypto = require('crypto')
const {promisify}= require('util')
const catchAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken')
const AppError = require("../utils/appError")
const sendEmail = require("../utils/email")

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
        changedPasswordAt:req.body.changedPasswordAt,
        role:req.body.role
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
exports.restrictTo = (...roles) => {
    return (req,res,next)=>{
       if(!roles.includes(req.user.role)){
        return next(new AppError('You are not eligible to perform this task',403))
       }

       next()
    }
}
exports.forgotPassword=catchAsync(async(req,res,next)=>{
    const {email} = req.body;
const user = await User.findOne({email})
if(!user){
    return next(new AppError('User Not Found',404))
}
const resetToken = user.createResetPasswordToken()
await user.save({validateBeforeSave:false})
//http://localhost:5000
//${req.protocol}://${req.get('host')}
const resetURL = `http://localhost:5000/api/users/resetpassword/${resetToken}`
const message = `forget passowrd? submit request to ${resetURL}`
try{
    await sendEmail({
        email:user.email,
        subject:'bhule gecho password?',
        message
    })
    res.status(200).json({
        status:'success',
        message:"token send to email"
    })
}catch(err){
user.passwordResetToken=undefined
user.passwordResetExpire=undefined
console.log(err)
await user.save({validateBeforeSave:false})
return next(new AppError('error in sending email',402))

}

})
exports.resetPassword=catchAsync(async(req,res,next)=>{
     //1) get user based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({passwordResetToken:hashedToken,passwordResetExpire:{$gt:Date.now()}})

    //2) if no user exists , give error

    if(!user){
        return next(new AppError('token is invalid or has expired',404))
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken=undefined;
    user.passwordResetExpire=undefined;
    await user.save()

    const token =signToken(user._id)
    res.status(200).json({
        status:'success',
        token
    })

})

exports.updatePassword = catchAsync(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    if(!user){
        return next(new AppError('user not found',404));
    }
    const currentPostedPassword = req.body.currentPassword;
    const isCorrect = await user.isCorrectPassword(currentPostedPassword,user.password);
    if(!isCorrect){
        return next(new AppError('Invalid Password',401))
    }
    user.password=req.body.password;
    user.confirmPassword=req.body.confirmPassword;
    await user.save()
    const token =signToken(user._id)
    res.status(200).json({
        status:'success',
        token
    })

})