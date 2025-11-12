// import other routes into here
const indexController = require("../controllers/indexController");
const signUpRouter = require("../routes/signupRoutes");

// called inside of app.js to mount the routes
const mountRoutes = (app) => {
  console.log("in mount routes...");
  app.get("/", indexController);
  app.use(signUpRouter);
};

module.exports = mountRoutes;
