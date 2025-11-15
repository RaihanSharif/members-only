const topicController = require("../controllers/topicController");

const { Router } = require("express");

const topicRouter = new Router();

topicRouter.get("/", topicController.getAllTopics);

topicRouter.get("/create-topic", topicController.getCreateTopicForm);

topicRouter.post("/create-topic", topicController.postCreateTopic);
module.exports = topicRouter;
