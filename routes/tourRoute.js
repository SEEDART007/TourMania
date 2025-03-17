const express = require('express')

const {getMonthlyPlan,getTourStats,getAllTours,getASingleTour,postTour,updateTour,deleteTour,aliasTopTours} = require('./../controllers/tourControllers')

const router = express.Router();


router.route('/top-5-cheap').get(aliasTopTours,getAllTours)
router.route('/get-stats').get(getTourStats)
router.route('/').get(getAllTours).post(postTour)
router.route('/:id').get(getASingleTour).put(updateTour).delete(deleteTour)
router.route('/monthly-plan/:year').get(getMonthlyPlan)

module.exports=router; 