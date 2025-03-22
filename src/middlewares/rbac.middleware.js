const allowRole = (role) => {
  return async (req,res,next) => {
    try {

      let loggedinUserRole = req.authUser.role

      if ((typeof role === 'string' && loggedinUserRole === role) ||
          (Array.isArray(role) && role.includes(loggedinUserRole))
      ) {
        next()
      } else {
        throw{code: 403, message: "Access Denied", status: "ACCESS_DENIED"}
      }
    } catch(exception) {
      console.log("Error allowing role: ", exception)
      next(exception)
    }
  }
}

module.exports = allowRole