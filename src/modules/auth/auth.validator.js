const Joi = require("joi")

const registerDTO = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().required(),
  password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*_-])[a-zA-Z\d!@#$%&*_-]{8,15}$/).required(),
  confirmPassword: Joi.string().equal(Joi.ref('password')).required(),
  country: Joi.string().required(),
  phone: Joi.string().required(),
  gender: Joi.string().regex(/^(male|female)$/).optional(),
  image: Joi.any().optional()
})

module.exports = registerDTO