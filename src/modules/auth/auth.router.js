const checkLogin = require("../../middlewares/auth.middleware")
const bodyValidator = require("../../middlewares/bodyValidator.middleware")
const upload = require("../../middlewares/multipart-parser.middleware")
const authCtrl = require("./auth.controller")
const {registerDTO,activateDTO,loginDTO} = require("./auth.validator")

const authRouter = require("express").Router()

authRouter.post('/register', upload().single('image'), bodyValidator(registerDTO), authCtrl.registerUser)
authRouter.post('/activate',bodyValidator(activateDTO), authCtrl.activateUser)
authRouter.post('/resend-otp', authCtrl.resendOTP)
authRouter.post('/login', bodyValidator(loginDTO), authCtrl.login)
authRouter.get('/me', checkLogin, authCtrl.getLoggedInUser)

module.exports = authRouter