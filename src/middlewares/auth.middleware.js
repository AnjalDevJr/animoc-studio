const authSvc = require("../modules/auth/auth.service")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const checkLogin = async(req,res,next) => {
  try {
    let token = req.headers['authorization']

    if(!token) {
      throw{code: 401, message: "token missing", status: "TOKEN_MISSING"}
    } 

    token = token.split(" ").pop()

    const data = jwt.verify(token, process.env.JWT_SECRET)

    if(data.typ !== 'bearer') {
      throw{code: 403, message: "Access token is required", status: "NOT_ACCESS_TOKEN"}
    }

    const user = await authSvc.getSingleUserByFilter({
      _id: data.sub
    })

    if(!user) {
      throw {code: 401, message: "User not found", status: "USER_NOT_FOUND"}
    }

    req.authUser = {
      _id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      country: user.country, 
      gender: user.gender, 
      phone: user.phone,
      image: user?.image,
      status: user.status
    }

    next()

  } catch(exception) {
    if(exception.name === 'TokenExpiredError') {
      next({code: 401, message: "Token Expired", status: "TOKEN_EXPIRED"})
    } else if(exception.name === 'JsonWebTokenError') {
      next({code: 401, message: exception.message, status: "TOKEN_ERROR"})
    }
    next(exception)
  }
}

const checkRefreshToken = async(req,res,next) => {
  try {
    let token = req.headers['refresh'] || null

    if(!token) {
      throw{code: 401, message: "token missing", status: "TOKEN_MISSING"}
    }

    token = token.split(" ").pop()

    const data = jwt.verify(token, process.env.JWT_SECRET)
    
    if(data.typ !== 'refresh') {
      throw{code: 401, message: "Refresh token is required", status: "REFRESH_TOKEN_NOT_FOUND"}
    }

    const user = await authSvc.getSingleUserByFilter({
      _id: data.sub
    })

    if(!user) {
      throw {code: 401, message: "User not found", status: "USER_NOT_FOUND"}
    }

    req.authUser = {
      _id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      country: user.country, 
      gender: user.gender, 
      phone: user.phone,
      image: user?.image,
      status: user.status
    }

    next()
  } catch(exception) {
    console.log("Error checking refresh token: ", exception)
    next(exception)
  }
}

module.exports = {
  checkLogin,
  checkRefreshToken
}