const fs = require('fs')
const mongoose = require('mongoose')
const Tour = require('./../../models/tourModel')
const User = require('./../../models/userModel')
const Review = require('./../../models/reviewModel')
const dotenv = require('dotenv')

dotenv.config();


const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'))

mongoose.connect(process.env.DB_STRING).then(res=>console.log("db successfully connected")).catch(res=>console.log(res))
const importData = async() =>{
    try{
        await Tour.create(tours);
        await User.create(users,{validateBeforeSave:false});
        await Review.create(reviews);
        console.log("data successfully loaded")
    }catch(err){
        console.log(err)
    }
    process.exit()
}

const deleteData = async()=>{
    try{
        await Tour.deleteMany()
        await User.deleteMany();
        await Review.deleteMany();
        console.log("all data successfully deleted")

    }catch(Err){
        console.log(Err)
    }
    process.exit()
}

if(process.argv[2]==='--import'){
    importData()
}else if(process.argv[2]==='--delete'){
    deleteData()
}