const topicController = require("../controllers/topicController");

const { Router } = require("express");

const topicRouter = new Router();

topicRouter.get("/", topicController.getAllTopics);

module.exports = topicRouter;
