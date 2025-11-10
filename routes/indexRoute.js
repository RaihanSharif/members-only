// import other routes into here

const someRouter = require("./someRoute");

// called inside of app.js to mount the routes
const mountRoutes = (app) => {
  app.use("/", someRouter);
  app.use("/", someRouter2);
  app.use("/", someRouter3);
};

module.exports = mountRoutes;
