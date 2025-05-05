const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviewContoller')
const authController = require('../controllers/authController')
router.route('/').get(authController.protect,authController.restrictTo('user'),reviewController.getAllReviews).post(authController.protect,authController.restrictTo('user'),reviewController.createReview)


module.exports=router;