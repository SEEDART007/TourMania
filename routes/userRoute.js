const express = require('express')
const {getUser} = require('./../controllers/userController')
const authController = require('./../controllers/authController')
const userController = require('./../controllers/userController')
const router = express.Router();

router.post('/signup',authController.signup)
router.post('/login',authController.login)

router.post('/forgotpassword',authController.forgotPassword)
router.patch('/resetpassword/:token',authController.resetPassword)
router.patch('/updateMyPassword',authController.protect,authController.updatePassword)
router.patch('/updateMe',authController.protect,userController.updateMe)

router.route('/').get(getUser)

module.exports=router