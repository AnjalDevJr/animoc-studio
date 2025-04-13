const bcrypt = require("bcryptjs")
const { otpGenerator } = require("../../utilities/utils")
const fileUploadSvc = require("../../services/fileUploader.service")
const UserModel = require("./user.model")
const emailSvc = require("../../services/mail.service")
require("dotenv").config()

class AuthService {
  transformUser = async (req,res,next) => {
    try {
      let data = req.body

      data.password = bcrypt.hashSync(data.password, 10)
      delete data.confirmPassword

      let file = req.file
      if(file) {
        console.log("Filepath: ", file.path)
        data.image = await fileUploadSvc.uploadFile(file.path, '/users-animoc-studio')
      }

      data.role = 'customer'
      data.otp = otpGenerator(6)
      data.otpExpiryTime = new Date(Date.now() + 300000)
      data.status = 'inactive'

      return data;
    } catch(exception) {
      console.log(exception)
      throw exception
    }
  }

  createUser = async(data) => {
    try {
      const userObj = new UserModel(data)
      return await userObj.save()
    } catch(exception) {
      console.log("Error creating user", exception)
      throw exception
    }
  } 

  sendActivationNotification = async(name, otp, email) => {
    try {
      let html = `
      <p>Dear ${name}</p>
      <p>Thank you for registering with us. To continue using our service, please activate your account first by using the following OTP code:
      </p>
      <p>
        <strong style="color: red;">${otp}</strong>
      </p>
      <p>Warm Regards,</p>
      <p>${process.env.SMTP_FROM}</p>      
      `

      return await emailSvc.sendEmail({
        to: email,
        subject: "Activate your account!",
        message: html
      })

    } catch(exception) {
      console.log("Error sending activation notification",exception)
      throw exception
    }
  }

  getSingleUserByFilter = async(filter) => {
    try {
      const user = await UserModel.findOne(filter)

      if(!user) {
        throw {
          code: 422,
          message: "User not found",
          status: "USER_NOT_FOUND",
          options: null
        }
      }
      return user
    } catch(exception) {
      console.log("Error getting single user by filter: ", exception)
      throw exception
    }
  }

  activateUser = async(user) => {
    try {
      user.status = 'active'
      user.otp = null,
      user.otpExpiryTime = null
      return await user.save()
    } catch(exception) {
      console.log("Error activating user via service: ", exception)
      throw exception
    }
  }

  resetOTP = async(user) => {
    try {
      user.otp = otpGenerator(6)
      user.otpExpiryTime = new Date(Date.now() + 300000)
      return await user.save()
    } catch(exception) {
      console.log("Error resetting OTP: ", exception)
      throw exception
    }
  }

  sendResendOtpNotification = async(name, otp, email) => {
    try {
      let html = `
      <p>Dear ${name}</p>
      <p>Your OTP code has been reset. Here is your new OTP code:
      </p>
      <p>
        <strong style="color: red;">${otp}</strong>
      </p>
      <p>${process.env.SMTP_FROM}</p>      
      `

      return await emailSvc.sendEmail({
        to: email,
        subject: "New OTP code!",
        message: html
      })

    } catch(exception) {
      console.log("Error resending new OTP code: ",exception)
      throw exception
    }
  }

  sendResetPasswordNotification = async(name,otp,email) => {
    try {
      const html = `
      <p>Dear ${name}</p>
      <p>You have requested to reset your password, here is your new OTP code: </p>
      <p>
        <strong style="color: red;">${otp}</strong>
      </p>
      <p>${process.env.SMTP_FROM}</p>
      `
      
      return await emailSvc.sendEmail({
        to: email,
        subject: "Reset password!",
        message: html
      })
    } catch(exception) {
      console.log("Error sending reset password notification: ", exception)
      throw exception
    }
  }

  resetPasswordService = async (data,password) => {
    try {
      let user = await UserModel.findOne(data)
      user.password = bcrypt.hashSync(password, 10)
      user.otpVerified = null
      return await user.save()
    } catch(exception) {
      console.log("Error resetting password service: ", exception)
      throw exception
    }
  }

  otpVerified = async(data) => {
    try {
      let user = await UserModel.findOne(data)
      user.otp = null
      user.otpExpiryTime = null
      user.otpVerified = true
      return await user.save()
    } catch(exception) {
      console.log("Error verifying otp service: ", exception)
      throw exception
    }
  }

}

const authSvc = new AuthService()
module.exports = authSvc