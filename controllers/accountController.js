// all route controllers relating to users
// TODO: route is /sign-up,
/*
1. get /sign-up -- display the sign up form.
2. post /sign-up -- process the submitted form
    a. validate
    b. call some qery to insert user into db, first checking that username, email or email aren't already
       in the system
*/
const bcrypt = require("bcryptjs");

const pool = require("../db/pool");

function getSignupForm(req, res, next) {
  console.log("rendering sign up form");
  res.render("sign-up", { title: "sign up to be a member" });
  next();
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

module.exports = {
  getSignupForm,
  postSignupForm,
};
