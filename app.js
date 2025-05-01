const express = require('express')
const app = express()
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoute')
const userRouter= require('./routes/userRoute')
const AppError = require('./utils/appError')
const rateLimit = require('express-rate-limit')


//middleware

app.use(express.json())


const limiter = rateLimit({
    max:100,
    windowMs : 60*60*1000,
    message:'too many request!!try again later'
})

app.use('/api',limiter)

app.use('/api/tours',tourRouter)
app.use('/api/users',userRouter)
app.all('*',(req,res,next)=>{
    next(new AppError(`Can't find ${req.originalUrl}`,404));
})

app.use(globalErrorHandler)



module.exports=app