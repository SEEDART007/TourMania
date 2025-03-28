const express = require('express')
const app = express()
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoute')
const userRouter= require('./routes/userRoute')
const AppError = require('./utils/appError')


//middleware

app.use(express.json())







app.use('/api/tours',tourRouter)
app.use('/api/users',userRouter)
app.all('*',(req,res,next)=>{
    next(new AppError(`Can't find ${req.originalUrl}`,404));
})

app.use(globalErrorHandler)



module.exports=app