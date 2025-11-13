const { body, validationResult, matchedData } = require("express-validator");
const pool = require("../db/pool");

//TODO: create a queries file

// user creation, login, update validators

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters";

const passwordlLenErr = "must be at least 8 characters long";
const alphaNumericErr = "must only contain letters and numbers";

/*
app.post(
  '/signup',
  body('email').custom(async value => {
    const existingUser = await Users.findUserByEmail(value);
    if (existingUser) {
      throw new Error('E-mail already in use');
    }
  }),
  (req, res) => {
    // Handle request
  },
);
*/

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
      const existingUser = await pool.query(
        "SELECT * FROM account WHERE email = $1",
        [value]
      );
      if (existingUser) {
        throw new Error("E-mail already in use");
      }
    })
    .normalizeEmail(),
  body("password")
    .trim()
    .isAlphanumeric()
    .withMessage("must be a number between 18 and 120"),
];

module.exports = validateUser;
