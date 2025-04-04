// const AppError = require("../utils/appError")

// //handling CastError
// const handleCastError=err=>{
//     const message = `Invalid ${err.path}:${err.value}`
//     return new AppError(message,404);
// }


// //for development error
// const sendErrorDev=(err,res)=>{
//     res.status(err.statusCode).json({
//         status:err.status,
//         err:err,
//         message:err.message,
//         stack:err.stack
//     })
// }
// //for production error
// const sendErrorProduction=(err,res)=>{
//     //operational error
//     if(err.isOperational){
//         res.status(err.statusCode).json({
//             status:err.status,
//             message:err.message,
//         })  
//         //some unknown or programming error
//     }else{
//         console.error('ERROR❤️',err);
//         res.status(500).json({
//             status:'error',
//             message:'Something went wrong!!!'
//         })
//     }
// }

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Internal Server Error';
     err.message = err.message
    //   if(process.env.NODE_ENV ==='development'){
    //    sendErrorDev(err,res);
    //   }else if(process.env.NODE_ENV ==='production'){
    //        let error = {...err}
    //        if(error.name==='CastError'){
    //         error = handleCastError(error)
    //        }

    //       sendErrorProduction(error,res)
    //   } 
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message
    })
}