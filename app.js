const express = require('express')
const path = require('path')
const app = express()
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoute')
const userRouter= require('./routes/userRoute')
const reviewRouter = require('./routes/reviewRoute')
const AppError = require('./utils/appError')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const sqlSanitizer = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

app.set('view engine','pug')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')))

app.get('/',(req,res)=>{
    res.status(200).render('base')
})

//middleware
app.use(helmet())
app.use(express.json())
//data sanitization for noSQL injections 

app.use(sqlSanitizer())

//for xss

app.use(xss())

//parameter preventions

app.use(hpp())


const limiter = rateLimit({
    max:100,
    windowMs : 60*60*1000,
    message:'too many request!!try again later'
})

app.use('/api',limiter)

app.use('/api/tours',tourRouter)
app.use('/api/users',userRouter)
app.use('/api/reviews',reviewRouter)
app.all('*',(req,res,next)=>{
    next(new AppError(`Can't find ${req.originalUrl}`,404));
})

app.use(globalErrorHandler)



module.exports=app