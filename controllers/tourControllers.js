
const Tour = require('./../models/tourModel')

exports.aliasTopTours=(req,res,next)=>{
    req.query.limit='5'
    req.query.sort='-ratingAverage,price'
    req.query.fields='name,price,ratingAverage,difficulty,summary'
    next()
}
exports.getTourStats=async(req,res)=>{
    try{
        const stats = await Tour.aggregate([{
            $match:{ ratingAverage:{$gte:4.5} }
        },{
            $group:{
                _id:{$toUpper:'$difficulty'},
                totalTours:{$sum:1},
                numRatings:{$sum:'$ratingsQuantity'},
                avgRating:{$avg:'$ratingAverage'},
                avgPrice:{$avg:'$price'},
                minPrice:{$min:'$price'},
                maxPrice:{$max:'$price'}
            }
        },{
            $sort:{avgPrice:1},
        }])

        res.status(200).json({
            status:'success',
            stats
        })
    }catch(err){
        res.status(404).json({
            status:"failed to retrieve data",
            message:err.message
        })
    }
    
}
exports.getAllTours=async(req,res)=>{

    try{
        const queryObj ={...req.query}
        const excludedFields=['page','limit','sort','fields']
        excludedFields.forEach(el=>delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj)
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`)
       
     let query = Tour.find(JSON.parse(queryStr))
     //sorting
     if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');

        query=query.sort(sortBy)
     }else{
        query = query.sort('-createdAt')
     }
 //field limiting
 if(req.query.fields){
    const fields  = req.query.fields.split(',').join(' ');
    query = query.select(fields)
 }else{
    query=query.select('-__v')
 }

 //pagination
 const limit = req.query.limit*1||100;
 const page = req.query.page*1||1;
 const skip = (page-1)*limit
 query = query.skip(skip).limit(limit)
 //throwing error if page and limit exceeds
 if(req.query.page){
    const numDocs = await Tour.countDocuments();
    if(skip>=numDocs){
        throw new Error('Doesnot exist')
    }
 }


        const tours = await query;
        res.status(200).json({
            status:'success',
            results:tours.length,
            tours
        })
    }catch(err){
        res.status(404).json({
            status:"failed to retrieve data",
            message:err.message
        })
    }

    
}


exports.postTour=async(req,res)=>{
    try{
        const newTour = await Tour.create(req.body)
        res.status(201).json({
            status:'success',
            message:'you successfully posted',
            yourBody:newTour,
            
        })
    }catch(err){
        res.status(400).json({
            status:"fail",
            message:err
        })
    }
    
}
exports.updateTour=async(req,res)=>{
   try{
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    res.status(201).json({
        status:'success',
        updatedTour
    })
   }catch(err){
    res.status(400).json({
        status:'failed to update',
        errorName:err.name,
        errorMsg:err.message
    })
   }
}
exports.deleteTour=async(req,res)=>{
    try{
        const deletedTour = await Tour.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status:'success',
            deletedTour
        })
    }catch(err){
        res.status(400).json({
            status:'failed to update',
            errorName:err.name,
            errorMsg:err.message
        })
    }
}
exports.getASingleTour=async(req,res)=>{
    try{
        const tour = await Tour.findById(req.params.id)
        res.status(200).json({
            status:'success',
            tour
        })
    }catch(err){
        res.status(404).json({
            status:'fail',
            errorName:err.name,
            errorMessage:err.message
        })
    }
   
}
exports.getMonthlyPlan=async(req,res)=>{
    try{
        const year = req.params.year*1;
        const plan = await Tour.aggregate([
           { $unwind:'$startDates'},{//unwind actually divides and array and returns diff. docs 
            $match:{
                startDates:{
                    
                    $gte:new Date(`${year}-01-01`),
                    $lte:new Date(`${year}-12-31`)
                }
            }
           },
           {
              $group:{
                _id:{$month:'$startDates'},
                numTour:{$sum:1},
                tours:{$push:'$name'}
              }
           },
           {
            $sort:{
                numTour:-1
            }
           },
           {
               $addFields:{month:'$_id'}
           },
           { 
            $project:{_id:0}
           }

        ])
        res.status(200).json({
            status:"successful",
            results:plan.length,
            plan
        })
    }catch(err){
        res.status(404).json({
            status:'fail',
            errorName:err.name,
            errorMessage:err.message
        })
    }
}