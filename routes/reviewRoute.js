const express = require('express')
const router = express.Router({mergeParams:true})
//mergeParams will be used to grab the /:tourid from the tour route
const reviewController = require('../controllers/reviewContoller')
const authController = require('../controllers/authController')
router.route('/').get(authController.protect,authController.restrictTo('user'),reviewController.getAllReviews).post(authController.protect,authController.restrictTo('user'),reviewController.createReview)
router.use(authController.protect, authController.restrictTo('user','admin'))
router.route('/:id').delete(reviewController.deleteReview).patch(reviewController.updateReview).get(reviewController.getReview)



module.exports=router;