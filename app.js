const express = require('express')
const app = express()
const tourRouter = require('./routes/tourRoute')
const userRouter= require('./routes/userRoute')


//middleware

app.use(express.json())







app.use('/api/tours',tourRouter)
app.use('/api/users',userRouter)



module.exports=app