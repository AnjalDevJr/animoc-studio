const mongoose = require("mongoose")
const { commonStr, schemaOpts } = require("../../common/schema")

const DesignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true
  }, 
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  ...commonStr
}, schemaOpts)

const DesignModel = mongoose.model("Design", DesignSchema)
module.exports = DesignModel