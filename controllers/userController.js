const User = require("../models/userModel")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const filterObj = (obj,...allowedFields)=>{
    const newObj={}
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)){
            newObj[el]=obj[el]
        }
    })
    return newObj;
}
exports.getUser=catchAsync(async(req,res,next)=>{
    const user = await User.find()
    res.status(200).json({
        status:'success',
        user
    })
})

exports.updateMe = catchAsync(async(req,res,next)=>{
    if(req.body.password || req.body.confirmPassword){
        return next(new AppError('This route is not for updating password, use updateMyPassword route',400))
    }
    const updateBody = filterObj(req.body,'name','email')
    const updatedUser = await User.findByIdAndUpdate(req.user.id,updateBody,{
        new:true,runValidators:true
    })
    res.status(200).json({
        status:'success',
        updatedUser
    })
})
exports.deleteMe = catchAsync(async(req,res,next)=>{
    const user = await User.findByIdAndUpdate(req.user.id,{active:false})

    res.status(204).json({
        status:'success',
        message:"user account successfully deactivated"
    })
})