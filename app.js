const express = require("express");
const app = express();
const path = require("node:path");
// const passport = require("./middlewares/authMiddleware.js");
// const session = require("express-session");
const authRouter = require("./routes/authRoutes.js");
const mountRoutes = require("./routes/indexRoute.js");

const assetsPath = path.join(__dirname, "public");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(assetsPath));

mountRoutes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Express app listening on port ${PORT}`);
});
