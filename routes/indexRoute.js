// mounts the different routes into the app

const authRouter = require("./authRoutes");
const passport = require("../middlewares/authMiddleware.js");
const session = require("express-session");
const topicRouter = require("./topicsRoutes.js");
const pool = require("../db/pool.js");
const pgSession = require("connect-pg-simple")(session);

// called inside of app.js to mount the routes
const mountRoutes = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new pgSession({
        pool: pool,
        createTableIfMissing: true,
      }),
      cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 days
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

  // app.use((err, req, res, next) => {
  //   console.log(err);
  //   res.send("there was an error", err.message);
  // });
};

module.exports = mountRoutes;
