const registerDTO = require("../modules/auth/auth.validator")

const bodyValidator = (schema) => {
  return async (req,res,next) => {
    try {
      const data = req.body
      await schema.validateAsync(data,{
        abortEarly: false
      })
      next()
    } catch(exception) {
      let messageBag = {}
      console.log("Validation Error: ",exception)
      exception.details.map((errDetail) => {
        messageBag[errDetail.context.label] = errDetail.message
      })
      // let obj = {};
      // obj["name"] = "John"; // Now obj = { name: "John" }
      // messageBag[errDetail.context.label] = errDetail.message
      // messageBag = {confirmPassword = "confirmPassword does not match password"}

      next({
        code: 400,
        detail: messageBag,
        message: "Validation Failed",
        status: "VALIDATION_FAILED",
      })
    }
  }
}

module.exports = bodyValidator