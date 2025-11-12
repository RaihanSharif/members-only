const bcrypt = require("bcryptjs");
const passport = require("../middlewares/authMiddleware");

const pool = require("../db/pool");

function getSignupForm(req, res) {
  console.log("rendering sign up form");
  res.render("sign-up", { title: "sign up to be a member" });
}

async function postSignupForm(req, res, next) {
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
}

function postLoginForm() {
  return () =>
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/",
    });
}

module.exports = {
  getSignupForm,
  postSignupForm,
  postLoginForm,
};
