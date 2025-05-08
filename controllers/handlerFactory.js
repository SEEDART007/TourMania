const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.deleteOne = Model =>catchAsync(async (req, res,next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if(!doc){
        return next(new AppError('No Document Found with that ID!!',404))
    }
    res.status(200).json({
      status: "success",
      doc,
    });
});

exports.updateOne = Model =>  catchAsync(async (req, res,next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if(!doc) return next(new AppError('No doc found with this id',404))
    res.status(201).json({
      status: "success",
      doc,
    });
});

exports.createOne = Model =>catchAsync(async (req, res,next) => {
    const doc = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      message: "you successfully posted",
      yourBody: doc,
    });
});

exports.getOne = (Model,popOptions)=>catchAsync(async (req, res,next) => {
    let query = Model.findById(req.params.id)
    if(popOptions) {
        query = query.populate(popOptions)
    }
    const doc = await query
    if(!doc){
        return next(new AppError('No Doc Found!!',404))
    }
    res.status(200).json({
      status: "success",
      doc,
    });
});


