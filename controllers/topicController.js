const pool = require("../db/pool");
const { validationResult, matchedData } = require("express-validator");
const topicValidator = require("../middlewares/topicValidator");

async function getAllTopics(req, res) {
  const { rows } = await pool.query(
    `SELECT t.id, t.title AS title,
    a.username AS author,
    COUNT(p.id) AS reply_count,
    to_char(t.created_at, 'DD Mon YYYY HH24:MM') AS created_at
    FROM topic t
    LEFT JOIN account a ON t.author_id = a.id
    LEFT JOIN post p ON p.topic_id = t.id
    GROUP BY t.id, t.title, a.username
    ORDER BY created_at DESC;`
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
      const { rows } = await pool.query(
        "INSERT INTO topic(title, body, author_id) VALUES \
      ($1, $2, $3) RETURNING id",
        [title, body, req.user.id]
      );
      res.redirect(`/topic/${rows[0].id}`);
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
      `SELECT topic.id, title, body, to_char(created_at, 'DD Mon YYYY HH24:MM') created_at, updated_at, username as author
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

async function postReply(req, res, next) {
  const topicID = req.params.id;
  const authorID = req.user.id;
  const body = req.body.body;
  console.log(topicID);

  if (!req.user.id) {
    return next(new Error("user must be logged in to post"));
  }

  try {
    await pool.query(
      `INSERT INTO post(body, author_id, topic_id) VALUES
      ($1, $2, $3)`,
      [body, authorID, topicID]
    );
    res.redirect(`/topic/${topicID}`);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getAllTopics,
  getSingleTopic,
  getCreateTopicForm,
  postCreateTopic,
  postReply,
};
