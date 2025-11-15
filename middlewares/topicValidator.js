const { body } = require("express-validator");
const pool = require("../db/pool");

const validateTopic = [
  body("title")
    .trim()
    .exists()
    .withMessage(`Topic must have a title`)
    .isLength({ min: 4, max: 255 })
    .withMessage(`Tile must be between 4 and 255 characters`),
  body("body")
    .trim()
    .exists()
    .withMessage("topic must have a body")
    .isLength({ min: 10 })
    .withMessage("Topic body must be at least 10 characters long"),
];

module.exports = validateTopic;
