const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_NAME,
      autoCreate: true,
      autoIndex: true
    })
    console.log("DB connected successfully...")
  } catch(exception) {
    console.log("Error connecting DB...")
    console.log(exception)
    process.exit()
  }
}

module.exports = connectDB