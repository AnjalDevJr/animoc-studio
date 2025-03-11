const express = require("express")
const animocRouter = require("../router/router.js")

const app = express()

app.use(express.json())
app.use(express.urlencoded({
  extended:false
}))

app.use('/animoc/v1', animocRouter)

module.exports = app