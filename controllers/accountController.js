const bcrypt = require("bcryptjs");
const passport = require("../middlewares/authMiddleware");

const { validationResult, matchedData, check } = require("express-validator");

const pool = require("../db/pool");
const validateUser = require("../middlewares/userValidators");

function getSignupForm(req, res) {
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

    const { fname, lname, username, email, password } = matchedData(req);

    try {
      console = hashedPassword = await bcrypt.hash(password, 12);

      const data = req.body;
      await pool.query(
        "INSERT INTO account (fname, lname, username, email, password) VALUES ($1, $2, $3, $4, $5)",
        [fname, lname, username, email, hashedPassword]
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
