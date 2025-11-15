const topicController = require("../controllers/topicController");

const { Router } = require("express");

const topicRouter = new Router();

topicRouter.get("/", topicController.getAllTopics);

topicRouter.get("/create-topic", topicController.getCreateTopicForm);

module.exports = topicRouter;
