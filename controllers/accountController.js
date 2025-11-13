const bcrypt = require("bcryptjs");
const passport = require("../middlewares/authMiddleware");

const { validationResult, matchedData } = require("express-validator");

const pool = require("../db/pool");
const validateUser = require("../middlewares/userValidators");

function getSignupForm(req, res) {
  console.log("rendering sign up form");
  if (req.user) {
    res.send("you are already logged in");
  } else {
    res.render("sign-up", {
      title: "sign up to be a member",
    });
  }
}

const postSignupForm = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      console = hashedPassword = await bcrypt.hash(req.body.password, 12);

      const data = req.body;
      await pool.query(
        "INSERT INTO account (fname, lname, username, email, password) VALUES ($1, $2, $3, $4, $5)",
        [data.fname, data.lname, data.username, data.email, hashedPassword]
      );
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  },
];

function postLogoutUser(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

const loginController = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
});

module.exports = {
  getSignupForm,
  postSignupForm,
  loginController,
  postLogoutUser,
};
