const authSvc = require("./auth.service")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()

class AuthController {
  registerUser = async (req,res,next) => {
    try {
      let data = await authSvc.transformUser(req)

      const user = await authSvc.createUser(data)

      await authSvc.sendActivationNotification(data.name, data.otp, data.email)

      res.json({
        data: user,
        message: "Account registered. Please activate your account.",
        status: "USER_REGISTERED_SUCCESSFULLY",
        options: null
        }
      )

    } catch(exception) {
      console.log("Error registering account: ",exception)
      next(exception)
    }
}
  // edit the error codes for all 
  activateUser = async(req,res,next) => {
    try {
      const data = req.body

      const user = await authSvc.getSingleUserByFilter({
        email: data.email
      })

      if (!user) {
        throw {
          code: 422,
          message: "Please register your account first",
          status: "ACTIVATION_FAILED",
        }
      }

      if(user.status === 'active') {
        throw{code: 403, message: "Account already activated", status: "ACCOUNT_ALREADY_ACTIVATED"}
      }

      let today = Date.now();
      let otpExpiryTime = user.otpExpiryTime.getTime()


      if (data.otp === user.otp) {
        if (otpExpiryTime > today) {
          await authSvc.activateUser(user)
        } else if (otpExpiryTime < today) {
          throw {code: 422, message: "OTP code has expired", status: "OTP_EXPIRED"}
        }
      } else if (data.otp !== user.otp) {
        throw {code: 403, message: "Invalid OTP code", status: "INVALID_OTP"}
      }

      res.json({
        data: user,
        message: "Account activated successfully",
        status: "ACCOUNT_ACTIVATED",
        options: null
      })

    } catch(exception) {
      console.log("Error activating user: ", exception)
      next(exception)
    }
  }

  resendOTP = async(req,res,next) => {
    try {
      const data = req.body
      let user = await authSvc.getSingleUserByFilter({email: data.email})

      user = await authSvc.resetOTP(user)

      await authSvc.sendResendOtpNotification(user.name, user.otp, user.email)

      res.json({
        data: {otp: user.otp},
        message: "OTP has been reset",
        status: "OTP_RESENT",
        options: null
      })
    } catch(exception) {
      console.log("Error resending OTP: ", exception)
      next(exception)
    }
  }

  login = async(req,res,next) => {
    try {
      const data = req.body
      const user = await authSvc.getSingleUserByFilter({
        email: data.email
      })

      if(!user) {
        throw {code: 401, message: "User not found, please register your account first", status: "USER_NOT_FOUND"}
      }

      if(user.status === 'inactive') {
        throw {code: 401, message: "Please activate your account first", status: "INACTIVE_ACCOUNT"}
      }

      if(bcrypt.compareSync(data.password, user.password)) {
        let accessToken = jwt.sign({
          sub: user._id,
          typ: "bearer"
        }, process.env.JWT_SECRET, {
          expiresIn: "1h"
        })

        let refreshToken = jwt.sign({
          sub: user._id,
          typ: "refresh"
        }, process.env.JWT_SECRET, {
          expiresIn: "10d"
        })

        res.json({
          detail: {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              image: user?.image
            }
          },
          message: "Login successful",
          status: "LOGIN_SUCCESS",
          options: null
        })
      } else {
        throw{code: 401, message: "Credential does not match", status: "CREDENTIAL_MISMATCH"}
      }
    } catch(exception) {
      console.log("Error logging in: ", exception)
      next(exception)
    }
  }

  getLoggedInUser = async(req,res,next) => {
    try {
      res.json({
        detail: req.authUser,
        message: "Your profile",
        status: "YOUR_PROFILE",
        options: null
      })
    } catch(exception) {
      console.log("Error getting logged in user: ", exception)
      next(exception)
    }
  } 

  getRefreshToken = async(req,res,next) => {
    try{
      let user = req.authUser

      let accessToken = jwt.sign({
        sub: user._id,
        typ: "bearer"
      }, process.env.JWT_SECRET, {
        expiresIn: "1h"
      })

      let refreshToken = jwt.sign({
        sub: user._id,
        typ: "refresh"
      }, process.env.JWT_SECRET, {
        expiresIn: "10d"
      })

      res.json({
        detail: {
          accessToken: accessToken,
          refreshToken: refreshToken
        },
        message: "Token refreshed",
        status: "TOKEN_REFRESHED",
        options: null
      })
    } catch(exception) { 
      console.log("Error getting refresh token: ", exception)
      next(exception)
    }
  }

  forgotPassword = async(req,res,next) => {
    try {
      let data = req.body

      let user = await authSvc.getSingleUserByFilter({
        email: data.email
      })

      if(user) {
        user = await authSvc.resetOTP(user)
        await authSvc.sendResetPasswordNotification(user.name, user.otp, user.email)
      } else {
        throw{code: 422, message: "User not found", status: "USER_NOT_FOUND"}
      }

      res.json({
        data: user,
        message: "OTP sent to email, please verify your email",
        status: "OTP_SENT",
        options: null
      })

    } catch(exception) {
      console.log("Error resetting password: ", exception)
      next(exception)
    }
  }

  verifyOTP = async (req,res,next) => {
    try {
      let data = req.body // email + otp

      let user = await authSvc.getSingleUserByFilter({
        email: data.email
      })

      let today = Date.now();
      let otpExpiryTime = user.otpExpiryTime.getTime()


      if (data.otp === user.otp) {
        if (otpExpiryTime > today) {
          await authSvc.otpVerified(user)
        } else if (otpExpiryTime < today) {
          throw {code: 422, message: "OTP code has expired", status: "OTP_EXPIRED"}
        }
      } else if (data.otp !== user.otp) {
        throw {code: 403, message: "Invalid OTP code", status: "INVALID_OTP"}
      }

      res.json({
        data: user,
        message: "OTP verified",
        status: "OTP_VERIFIED",
        options: null
      })
    } catch(exception) {
      console.log("Error verifying OTP: ", exception)
      next(exception)
    }
  }
 
  resetPassword = async (req,res,next) => {
    try { 
      let data = req.body // email + password + confirmPassword

      let user = await authSvc.getSingleUserByFilter({
        email: data.email
      })

      if (user.otpVerified) {
        if(bcrypt.compareSync(data.password, user.password)) {
          throw{code: 400, message: "New password should not be the same as the old password", status: "CONFLICTING_PASSWORD"}
        } else if(data.password !== data.confirmPassword) {
          throw{code: 400, message: "Password should match confirmPassword", status: "PASSWORD_MISMATCH"}
        } else if(data.password === data.confirmPassword) {
          user = await authSvc.resetPasswordService(user, data.password)
        }
      } else {
        throw{code: 401, message: "Please verify your otp first", status: "OTP_NOT_VERIFIED"}
      }

      res.json({
        data: user,
        message: "Password reset successful",
        status: "PASSWORD_RESET",
        options: null
      })
    } catch(exception) { 
      console.log("Error creating new password: ", exception)
      next(exception)
    }
  }

}

const authCtrl = new AuthController()
module.exports = authCtrl