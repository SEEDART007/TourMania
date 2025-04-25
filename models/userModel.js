const mongoose = require('mongoose')
const validator = require('validator');
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
   name:{
    type:String,
    required:[,'Please tell your name']
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
   }
})
userSchema.pre('save',async function(next){
if(!this.isModified('password')) return next();

this.password =await  bcrypt.hash(this.password,12);
this.confirmPassword = undefined;// no need to save this in db so its just needed for validation
next()
})
userSchema.methods.isCorrectPassword = async function(canPass,userPass){
    return await bcrypt.compare(canPass,userPass);
}
const User = mongoose.model('User',userSchema);
module.exports=User;