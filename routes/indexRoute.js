// import other routes into here
const indexController = require("../controllers/indexController");

// called inside of app.js to mount the routes
const mountRoutes = (app) => {
  app.use("/", indexController);
};

module.exports = mountRoutes;
