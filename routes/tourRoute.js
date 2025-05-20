const express = require('express')
const authController = require('../controllers/authController')
const {getDistances,getToursWithin,getMonthlyPlan,getTourStats,getAllTours,getASingleTour,postTour,updateTour,deleteTour,aliasTopTours} = require('./../controllers/tourControllers')
const router = express.Router();
const reviewRouter = require('./../routes/reviewRoute')

// router.route('/:tourid/reviews').post(authController.protect,authController.restrictTo('user'),reviewController.createReview)
router.use("/:tourid/reviews",reviewRouter)
router.route('/top-5-cheap').get(aliasTopTours,getAllTours)
router.route('/get-stats').get(getTourStats)
router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(getToursWithin)
router.route('/distances/:latlng/unit/:unit').get(getDistances)
router.route('/').get(getAllTours).post(authController.protect,authController.restrictTo('admin','lead-guide'),postTour)
router.route('/:id').get(getASingleTour).put(authController.protect,authController.restrictTo('admin','lead-guide'),updateTour).delete(authController.protect,authController.restrictTo('admin'),deleteTour)
router.route('/monthly-plan/:year').get(authController.protect,authController.restrictTo('admin','lead-guide','guide'),getMonthlyPlan)


 
module.exports=router; 