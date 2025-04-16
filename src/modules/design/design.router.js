const { checkLogin } = require("../../middlewares/auth.middleware")
const bodyValidator = require("../../middlewares/bodyValidator.middleware")
const upload = require("../../middlewares/multipart-parser.middleware")
const allowRole = require("../../middlewares/rbac.middleware")
const designCtrl = require("./design.controller")
const designCreateDTO = require("./design.validator")

const designRouter = require("express").Router()

designRouter.get("/get-home", designCtrl.getForHome)
designRouter.get("/:slug/by-slug", designCtrl.getDesignBySlug)

designRouter.route("/")
  .post(checkLogin, allowRole("admin"), upload().single('image'), designCtrl.create, bodyValidator(designCreateDTO))
  .get(checkLogin, allowRole("admin"), designCtrl.index)

designRouter.route("/:id")
  .get(checkLogin, allowRole(["admin", "customer"]), designCtrl.detail)
  .patch(checkLogin, allowRole(["admin"]), upload().single('image'), designCtrl.update)
  .delete(checkLogin, allowRole(["admin"]), designCtrl.delete)

module.exports = designRouter