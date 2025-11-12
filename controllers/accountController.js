// all route controllers relating to users
// TODO: route is /sign-up,
/*
1. get /sign-up -- display the sign up form.
2. post /sign-up -- process the submitted form
    a. validate
    b. call some qery to insert user into db, first checking that username, email or email aren't already
       in the system
*/

function getSignupForm(req, res) {
  console.log("rendering sign up form");
  res.render("sign-up", { title: "sign up to be a member" });
}

function postSignupForm(req, res) {
  res.json(req.body);
}

module.exports = {
  getSignupForm,
  postSignupForm,
};
