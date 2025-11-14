const pool = require("../db/pool");

async function getAllTopics(req, res) {
  const { rows } = await pool.query(
    `SELECT t.title AS title,
    a.username AS author,
    COUNT(p.id) AS reply_count,
    t.created_at
    FROM topic t
    JOIN account a ON t.author_id = a.id
    LEFT JOIN post p ON p.topic_id = t.id
    GROUP BY t.id, t.title, a.username
    ORDER BY t.id;`
  );
  res.render("index", { title: "welcome to members only", topicList: rows });
}

async function getSingleTopic(req, res, next) {}

module.exports = {
  getAllTopics,
  getSingleTopic,
};
