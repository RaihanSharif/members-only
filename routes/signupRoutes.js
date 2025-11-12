const { Router } = require("express");

const accountController = require("../controllers/accountController");

const signUpRouter = new Router();

signUpRouter.get("/sign-up", accountController.getSignupForm);

signUpRouter.post("/sign-up", accountController.postSignupForm);

module.exports = signUpRouter;
