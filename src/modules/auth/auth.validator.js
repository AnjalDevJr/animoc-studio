const Joi = require("joi")

const registerDTO = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Name should not be empty"
  }),
  email: Joi.string().required().messages({
    "string.empty": "Email should not be empty"
  }),
  password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*_-])[a-zA-Z\d!@#$%&*_-]{8,15}$/).required().messages({
    "string.empty": "Password should not be empty",
    "string.pattern.base": "Password should contain atleast one Capital Letter,one Small Letter, one digit and a special Character"
  }),
  confirmPassword: Joi.string().equal(Joi.ref('password')).required().messages({
    "string.empty": "confirmPassword should not be empty",
    "any.only": "confirmPassword does not match password" 
  }),
  country: Joi.string().required().messages({
    "string.empty": "country should not be empty"
  }),
  phone: Joi.string().required().messages({
    "string.empty": "phone number should not be empty"
  }),
  gender: Joi.string().regex(/^(male|female)$/).optional().messages({
    "string.pattern.base": "Gender should be either male or female"
  }),
  image: Joi.any().optional()
})

module.exports = registerDTO