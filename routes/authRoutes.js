const { Router } = require("express");

const accountController = require("../controllers/accountController");
const passport = require("../middlewares/authMiddleware");

const authRouter = new Router();

authRouter.get("/sign-up", accountController.getSignupForm);

authRouter.post("/sign-up", accountController.postSignupForm);

authRouter.post("/log-in", accountController.loginController);

authRouter.post("/log-out", accountController.postLogoutUser);

module.exports = authRouter;
