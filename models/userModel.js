const mongoose = require('mongoose')
const validator = require('validator');
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
   name:{
    type:String,
    required:[true,'Please tell your name']
   },
   email:{
    type:String,
    required:[true,'Please tell your email'],
    unique:true,
    lowercase:true,
    validate:[validator.isEmail,'Please provide a valid email']
   },
   photo:{
    type:String
   },
   role:{
    type:String,
    enum:['user','guide','lead-guide','admin'],
    default:'user'
   },
   password:{
    type:String,
    required:[true,'provide a password'],
    minlength:[8,'please provide a 8 digit long password']
   },
   confirmPassword:{
    type:String,
    required:[true,'confirm correctly'],
    validate:{
        //only works for create and save!!
        validator:function(el){
            return el===this.password;
        },
        message:'passwords are different!!'
    }
   },
   changedPasswordAt:{
    type: Date
   },
   passwordResetToken:String,
   passwordResetExpire:Date,
   active:{
    type:Boolean,
    default:true
   }
})
userSchema.pre('save',async function(next){
if(!this.isModified('password')) return next();

this.password =await  bcrypt.hash(this.password,12);
this.confirmPassword = undefined;// no need to save this in db so its just needed for validation
next()
})

//works with every find
userSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}})
    next()
})
userSchema.pre('save',function(next){
    if(!this.isModified('password')||this.isNew) return next();

    this.changedPasswordAt=Date.now()-1000;
    next()
})
userSchema.methods.isCorrectPassword = async function(canPass,userPass){
    return await bcrypt.compare(canPass,userPass);
}
userSchema.methods.changedPasswordAfter = function(JWTTimeStamp){
   if(this.changedPasswordAt){
    const changedTime = parseInt(this.changedPasswordAt.getTime()/1000)
      return JWTTimeStamp < changedTime;
   }
   return false;
}
userSchema.methods.createResetPasswordToken = function(){
const resetToken  = crypto.randomBytes(32).toString('hex')
this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex')
this.passwordResetExpire = Date.now() + 10*60*1000
console.log({resetToken},this.passwordResetToken)
return resetToken;
}
const User = mongoose.model('User',userSchema);
module.exports=User;