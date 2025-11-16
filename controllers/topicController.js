const pool = require("../db/pool");
const { validationResult, matchedData } = require("express-validator");
const topicValidator = require("../middlewares/topicValidator");

async function getAllTopics(req, res) {
  const { rows } = await pool.query(
    `SELECT t.id, t.title AS title,
    a.username AS author,
    COUNT(p.id) AS reply_count,
    to_char(t.created_at, 'DD:MM:YYYY HH24:MM') AS created_at
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

  let topic;
  let replies;

  try {
    const { rows } = await pool.query(
      `SELECT title, body, to_char(created_at, 'DD-MM-YYYY HH24:MM') created_at, updated_at, username as author
      FROM topic FULL JOIN account
      ON topic.author_id = account.id
      WHERE topic.id = $1`,
      [topicID]
    );
    topic = rows[0];
  } catch (err) {
    return next(err);
  }

  try {
    const { rows } = await pool.query(
      "SELECT post.body, post.created_at, post.updated_at, account.username as author \
      FROM post JOIN account ON \
      post.author_id = account.id \
      WHERE topic_id = $1;",
      [topicID]
    );
    replies = rows;
  } catch (err) {
    return next(err);
  }

  res.render("singleTopic", {
    title: `${topic.title}`,
    topic: topic,
    replies: replies,
  });
}

module.exports = {
  getAllTopics,
  getSingleTopic,
  getCreateTopicForm,
  postCreateTopic,
};
