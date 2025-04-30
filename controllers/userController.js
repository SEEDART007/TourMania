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
exports.getUser=(req,res)=>{
    res.status(200).json({
        message:'you have reached to user route'
    })
}

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