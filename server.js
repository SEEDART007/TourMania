const app = require('./app')
const mongoose = require('mongoose')

const dotenv = require('dotenv');
dotenv.config()

port=process.env.PORT||4000;
 






mongoose.connect(process.env.DB_STRING).then(res=>{
    console.log("db connected")
}).catch(e=>console.log("error"))
app.listen(port,()=>{
    console.log(`app is listening on ${port}`)
}) 