const { body } = require("express-validator");
const pool = require("../db/pool");

//TODO: create a queries file

// user creation, login, update validators

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters";

const alphaNumericErr = "must only contain letters and numbers";

// TODO: isStrongPassword validator research
const validateUser = [
  body("fname")
    .trim()
    .optional({ nullable: true, checkFalsy: true })
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 255 })
    .withMessage(`First name ${lengthErr}`),
  body("lname")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 255 })
    .withMessage(`Last name ${lengthErr}`),
  body("username")
    .trim()
    .isAlphanumeric()
    .withMessage(`Username ${alphaNumericErr}`)
    .isLength({ min: 1, max: 255 }),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage(`Please use correct email formatting`)
    .custom(async (value) => {
      const { rows } = await pool.query(
        "SELECT * FROM account WHERE email = $1",
        [value]
      );

      if (rows.length >= 1) {
        throw new Error("E-mail already in use");
      }
    })
    .normalizeEmail(),
  // { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1,
  // returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10,
  // pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }
  body("password")
    .trim()
    .isStrongPassword()
    .withMessage(
      "password must be at least 8 characters long, contain 1 lowercase letter, one uppercase letter, and 1 symbol"
    )
    .escape(),
  body("confirm-password")
    .trim()
    .isStrongPassword()
    .withMessage(
      "password must be at least 8 characters long, contain 1 lowercase letter, one uppercase letter, and 1 symbol"
    )
    .escape()
    .custom((value, { req, loc, path }) => {
      if (value !== req.body.password) {
        throw new Error("passwords do not match");
      } else {
        return value;
      }
    }),
];

module.exports = validateUser;
