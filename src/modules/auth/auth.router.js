const {checkLogin, checkRefreshToken} = require("../../middlewares/auth.middleware")
const bodyValidator = require("../../middlewares/bodyValidator.middleware")
const upload = require("../../middlewares/multipart-parser.middleware")
const authCtrl = require("./auth.controller")
const {registerDTO,activateDTO,loginDTO, forgotPasswordDTO, verifyOtpDTO, resetPasswordDTO} = require("./auth.validator")

const authRouter = require("express").Router()

authRouter.post('/register', upload().single('image'), bodyValidator(registerDTO), authCtrl.registerUser)
authRouter.post('/activate',bodyValidator(activateDTO), authCtrl.activateUser)
authRouter.post('/resend-otp', authCtrl.resendOTP)

authRouter.post('/login', bodyValidator(loginDTO), authCtrl.login)

authRouter.get('/me', checkLogin, authCtrl.getLoggedInUser)
authRouter.get('/refresh', checkRefreshToken, authCtrl.getRefreshToken)

authRouter.post('/forgot-password', bodyValidator(forgotPasswordDTO), authCtrl.forgotPassword)
authRouter.post('/verify-otp', bodyValidator(verifyOtpDTO) , authCtrl.verifyOTP)
authRouter.post('/reset-password', bodyValidator(resetPasswordDTO), authCtrl.resetPassword)

module.exports = authRouter