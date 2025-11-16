const topicController = require("../controllers/topicController");

const { Router } = require("express");

const topicRouter = new Router();

topicRouter.get("/", topicController.getAllTopics);

topicRouter.get("/create-topic", topicController.getCreateTopicForm);

topicRouter.post("/create-topic", topicController.postCreateTopic);

topicRouter.get("/topic/:id", topicController.getSingleTopic);
topicRouter.post("/topic/:id/reply", topicController.postReply);
module.exports = topicRouter;
