const mongoose = require('mongoose')
const catchAsync = require('../utils/catchAsync')
const Review = require('../models/reviewModel')
const factory = require('./handlerFactory')
exports.getAllReviews=catchAsync(async(req,res,next)=>{
    let filter = {}
    if(req.params.tourid) filter = {tour:req.params.tourid}
const reviews = await Review.find(filter);
res.status(200).json({
    status:'success',
    results:reviews.length,
    reviews
})
})

exports.createReview = catchAsync(async(req,res,next)=>{
    if(!req.body.tour) req.body.tour = req.params.tourid
    if(!req.body.user) req.body.user = req.user.id
    const review = await Review.create(req.body)
    res.status(201).json({
        status:'success',
        review
    })
})

exports.deleteReview = factory.deleteOne(Review);