const mongoose = require('mongoose')
const slugify = require('slugify')

const tourSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'bc required hai'],
        unique:true,
        trim:true,
        maxlength:[40,'A tour must have length less than 40'],//validator
        minlength:[5, 'A tour must have atleast 5 chars in its name']//validator
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
        required:[true,'A tour should have a difficulty'],
        enum:{
            values:['easy','medium','difficult'],
            message:'Difficulty must be : easy,medium,difficult'
        }//validator
    },
    ratingAverage:{
        type:Number,
        default:4.5,
        min: [1, 'A rating must be above 1.0'],//validator
        max: [5, 'A rating must be below 5.0']//validator
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
    secretTour:{
           type:Boolean,
           default:false
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
//QUERY MIDDLEWARE 
tourSchema.pre(/^find/,function(next){ // ^ means all starting with find like findOne
         this.find({secretTour:{$ne:true}})
    next();

})
//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate',function(next){
    this.pipeline().unshift({$match:{secretTour:{$ne:true }}})//didn't show secretTour in aggregation
    next()
})
const Tour = mongoose.model('Tour',tourSchema)

module.exports=Tour;