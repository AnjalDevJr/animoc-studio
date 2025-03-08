const router = require("express").Router()
const authRouter = require("../modules/auth/auth.router")
const designRouter = require("../modules/design/design.router")

router.use("/auth", authRouter)
router.use("/design", designRouter)

module.exports = router