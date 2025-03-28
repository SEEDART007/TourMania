const express = require('express')
const app = express()
const tourRouter = require('./routes/tourRoute')
const userRouter= require('./routes/userRoute')


//middleware

app.use(express.json())







app.use('/api/tours',tourRouter)
app.use('/api/users',userRouter)
app.all('*',(req,res,next)=>{
    const err = new Error(`Can't find ${req.originalUrl}`)
    err.status='fail';
    err.statusCode=404;
    next(err);
})

app.use((err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Internal Server Error';
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message
    })
  
})



module.exports=app