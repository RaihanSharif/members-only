const pool = require("../db/pool");
const { validationResult, matchedData } = require("express-validator");
const topicValidator = require("../middlewares/topicValidator");

async function getAllTopics(req, res) {
  const { rows } = await pool.query(
    `SELECT t.id, t.title AS title,
    a.username AS author,
    COUNT(p.id) AS reply_count,
    t.created_at
    FROM topic t
    LEFT JOIN account a ON t.author_id = a.id
    LEFT JOIN post p ON p.topic_id = t.id
    GROUP BY t.id, t.title, a.username
    ORDER BY t.id;`
  );
  console.log(rows);
  res.render("index", { title: "welcome to members only", topicList: rows });
}

function getCreateTopicForm(req, res) {
  if (req.user) {
    res.render("createTopic", { title: "create new topic" });
  } else {
    res.send("you must be logged in to create a topic");
  }
}

const postCreateTopic = [
  topicValidator,
  async (req, res, next) => {
    if (!req.user) {
      return next(new Error("user is not currently logged in"));
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, body } = matchedData(req);
    try {
      console.log(req.user.id);
      await pool.query(
        "INSERT INTO topic(title, body, author_id) VALUES \
      ($1, $2, $3)",
        [title, body, req.user.id]
      );
      // TODO: Later this should redirect to the topic page of the individual topic
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  },
];

async function getSingleTopic(req, res, next) {
  const topicID = req.params.id;
  console.log(topicID);
  res.send(topicID);
}

module.exports = {
  getAllTopics,
  getSingleTopic,
  getCreateTopicForm,
  postCreateTopic,
};
