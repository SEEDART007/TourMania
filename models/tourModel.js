const mongoose = require('mongoose')
const slugify = require('slugify')

const tourSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'bc required hai'],
        unique:true,
        trim:true
    },
    slug:String,
    duration:{
        type:Number,
        required:[true,'A tour must have a duration']
    },
    maxGroupSize:{
        type:Number,
        required:[true,'A tour must have a group size']
    },
    difficulty:{
        type:String,
        required:[true,'A tour should have a difficulty']
    },
    ratingAverage:{
        type:Number,
        default:4.5,
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,'price dede bc']
    },
    priceDiscount:{
        type:Number
    },
    summary:{
        type:String,
        trim:true,
        required:[true,'Tour summary is required']
    },
    description:{
        type:String,
        trim:true,
    },
    imageCover:{
        type:String,
        required:[true,'Tour image is must']
    },
    images:[String],
    startDates:[Date]
    
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
})

//DOCUMENT MIDDLEWARE:runs before .save() and .create() 
tourSchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower:true});
    next();
})
const Tour = mongoose.model('Tour',tourSchema)

module.exports=Tour;