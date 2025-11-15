const pool = require("../db/pool");
const { validationResult, matchedData } = require("express-validator");
const topicValidator = require("../middlewares/topicValidator");

async function getAllTopics(req, res) {
  const { rows } = await pool.query(
    `SELECT t.title AS title,
    a.username AS author,
    COUNT(p.id) AS reply_count,
    t.created_at
    FROM topic t
    LEFT JOIN account a ON t.author_id = a.id
    LEFT JOIN post p ON p.topic_id = t.id
    GROUP BY t.id, t.title, a.username
    ORDER BY t.id;`
  );
  res.render("index", { title: "welcome to members only", topicList: rows });
}

function getCreateTopicForm(req, res) {
  if (req.user) {
    res.render("createTopic", { title: "create new topic" });
  } else {
    res.send("you must be logged in to create a topic");
  }
}

const createTopic = [
  topicValidator,
  (req, res, next) => {
    console.log(req.user);
    res.send("asdf");
  },
];

async function getSingleTopic(req, res, next) {}

module.exports = {
  getAllTopics,
  getSingleTopic,
  getCreateTopicForm,
};
