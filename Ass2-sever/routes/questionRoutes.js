const express = require("express");
const router = express.Router();
const controller = require("../controllers/questionController");
const { verifyUser, verifyAuthor , verifyAdmin } = require("../authenticate");

router.get("/", controller.getAllQuestions);
router.get("/:id", controller.getQuestionById);
router.put("/:id", verifyUser, verifyAuthor, controller.updateQuestionById);
router.delete("/:id", verifyUser, verifyAuthor, controller.deleteQuestionById);
router.delete("/", verifyUser, verifyAdmin, controller.deleteAllQuestions);
router.post("/", verifyUser, controller.createQuestion);

module.exports = router;