const mongoose = require("mongoose")
const populateAdmin = require("../seeder/admin.seeder")
require("dotenv").config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_NAME,
      autoCreate: true,
      autoIndex: true
    })
    console.log("Admin table seeding started...")
    await populateAdmin()
    console.log("Admin table seeding completed...")
    console.log("DB connected successfully...")
  } catch(exception) {
    console.log("Error connecting DB...")
    console.log(exception)
    process.exit()
  }
}

module.exports = connectDB