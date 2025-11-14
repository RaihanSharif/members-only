// mounts the different routes into the app

const authRouter = require("./authRoutes");
const passport = require("../middlewares/authMiddleware.js");
const session = require("express-session");
const topicRouter = require("./topicsRoutes.js");

// called inside of app.js to mount the routes
const mountRoutes = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(passport.session());

  app.use((req, res, next) => {
    if (req.user) {
      res.locals.currentUser = req.user;
    }
    next();
  });
  app.use(authRouter);
  app.use(topicRouter);
};

module.exports = mountRoutes;
