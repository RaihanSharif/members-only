const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");

const localStrat = new LocalStrategy(async (username, password, done) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM account WHERE username = $1",
      [username]
    );
    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);

    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    if (!match) {
      return done(null, false, { message: "Incorrect password" });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

passport.use(localStrat);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM account WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    return done(err);
  }
});

module.exports = passport;
