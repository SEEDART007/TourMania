const express = require('express')
const app = express()
const tourRouter = require('./routes/tourRoute')
const userRouter= require('./routes/userRoute')


//middleware

app.use(express.json())







app.use('/api/tours',tourRouter)
app.use('/api/users',userRouter)
app.all('*',(req,res,next)=>{
    res.status(404).json({
        status:'fail',
        message:`Can't find ${req.originalUrl}`
    })
})



module.exports=app