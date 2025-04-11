const express = require("express")
const animocRouter = require("../router/router.js")
const cors = require("cors")

const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({
  extended:false
}))

app.use('/animoc/v1', animocRouter)

app.use((error,req,res,next) => {
  
  let code = error.code || 500
  let detail = error.detail || {}
  let message = error.message || "Internal Server Error"
  let status = error.status || "INTERNAL_SERVER_ERROR"
  console.log(error)

  res.status(code).json({
    data: detail,
    message: message,
    status: status,
    options: null
  })
})

module.exports = app