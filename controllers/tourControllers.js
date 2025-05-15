const Tour = require("./../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require('./handlerFactory')

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name,price,ratingAverage,difficulty,summary";
  next();
};

exports.getTourStats = catchAsync(async (req, res,next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        totalTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    stats,
  });
});
exports.getAllTours = catchAsync(async (req, res,next) => {
  const queryObj = { ...req.query };
  const excludedFields = ["page", "limit", "sort", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = Tour.find(JSON.parse(queryStr));
  //sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");

    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  //field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  //pagination
  const limit = req.query.limit * 1 || 100;
  const page = req.query.page * 1 || 1;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);
  //throwing error if page and limit exceeds
  if (req.query.page) {
    const numDocs = await Tour.countDocuments();
    if (skip >= numDocs) {
      throw new Error("Doesnot exist");
    }
  }

  const tours = await query;
  res.status(200).json({
    status: "success",
    results: tours.length,
    tours,
  });
});

exports.postTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (req, res,next) => {
//     const deletedTour = await Tour.findByIdAndDelete(req.params.id);
//     if(!deletedTour){
//         return next(new AppError('No Tour Found!!',404))
//     }
//     res.status(200).json({
//       status: "success",
//       deletedTour,
//     });
// });
exports.getASingleTour = factory.getOne(Tour,{path:'reviews'})
exports.getMonthlyPlan = catchAsync(async (req, res,next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      { $unwind: "$startDates" },
      {
        //unwind actually divides and array and returns diff. docs
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTour: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $sort: {
          numTour: -1,
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: { _id: 0 },
      },
    ]);
    res.status(200).json({
      status: "successful",
      results: plan.length,
      plan,
    });
});

exports.getToursWithin= catchAsync(async(req,res,next)=>{
  const {distance,latlng,unit}= req.params;
  const [lat,lng]= latlng.split(",")
  const radius = unit ==='mi'?distance/3963.2 : distance/6378.1
  if(!lat || !lng){
    next(new AppError('provide latitude & longitude in lat,lng format',400))
  }
  const tours = await Tour.find({startLocation:{$geoWithin:{$centerSphere:[[lng,lat],radius]}}})
  res.status(200).json({
    status:'success',
    results:tours.length,
    data:{
      tours
    }
  })
})
