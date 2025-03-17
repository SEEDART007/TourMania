const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username:String,
    userId:Number
})
const User = mongoose.model('User',userSchema);
module.exports=User;