const mongoose = require('mongoose')
const catchAsync = require('../utils/catchAsync')
const Review = require('../models/reviewModel')
exports.getAllReviews=catchAsync(async(req,res,next)=>{
const reviews = await Review.find();
res.status(200).json({
    status:'success',
    reviews
})
})

exports.createReview = catchAsync(async(req,res,next)=>{
    const review = await Review.create(req.body)
    res.status(201).json({
        status:'success',
        review
    })
})