const express = require('express')
const {getUser} = require('./../controllers/userController')
const authController = require('./../controllers/authController')
const router = express.Router();

router.post('/signup',authController.signup)



router.route('/').get(getUser)

module.exports=router