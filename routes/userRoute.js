const express = require('express')
const {getUser} = require('./../controllers/userController')
const authController = require('./../controllers/authController')
const userController = require('./../controllers/userController')
const router = express.Router();

router.post('/signup',authController.signup)
router.post('/login',authController.login)

router.route('/me').get(authController.protect,userController.getMe,userController.getUser)
router.post('/forgotpassword',authController.forgotPassword)
router.patch('/resetpassword/:token',authController.resetPassword)
router.patch('/updateMyPassword',authController.protect,authController.updatePassword)
router.patch('/updateMe',authController.protect,userController.updateMe)
router.delete('/deleteMe',authController.protect,userController.deleteMe)
router.delete('/deleteMe/:id',authController.protect,authController.restrictTo('admin'),userController.deleteMe)
router.route('/updateMe/:id').patch(authController.protect,authController.restrictTo('admin'),userController.updateUser)
router.route('/createUser/:id',userController.createUser)



router.route('/').get(getUser)

module.exports=router