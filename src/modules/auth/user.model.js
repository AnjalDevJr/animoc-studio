const mongoose = require("mongoose")
const { commonStr } = require("../../common/schema")

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 2,
    max: 50,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: {
      values: ['male','female']
    }
  },
  phone: String,
  image: String,
  role: {
    type: String,
    default: "customer"
  },
  otp: String,
  otpExpiryTime: Date,
  otpVerified: Boolean,
  ...commonStr
},{
  timestamps: true,      
  autoCreate: true, 
  autoIndex: true
})

const UserModel = mongoose.model("User", UserSchema)

module.exports = UserModel