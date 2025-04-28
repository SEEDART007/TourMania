const express = require('express')
const {getUser} = require('./../controllers/userController')
const authController = require('./../controllers/authController')
const router = express.Router();

router.post('/signup',authController.signup)
router.post('/login',authController.login)

router.post('/forgotpassword',authController.forgotPassword)
router.patch('/resetpassword/:token',authController.resetPassword)


router.route('/').get(getUser)

module.exports=router