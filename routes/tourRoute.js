const express = require('express')
const authController = require('../controllers/authController')
const {getMonthlyPlan,getTourStats,getAllTours,getASingleTour,postTour,updateTour,deleteTour,aliasTopTours} = require('./../controllers/tourControllers')

const router = express.Router();


router.route('/top-5-cheap').get(aliasTopTours,getAllTours)
router.route('/get-stats').get(getTourStats)
router.route('/').get(authController.protect,getAllTours).post(postTour)
router.route('/:id').get(getASingleTour).put(updateTour).delete(authController.protect,authController.restrictTo('admin'),deleteTour)
router.route('/monthly-plan/:year').get(getMonthlyPlan)

module.exports=router; 