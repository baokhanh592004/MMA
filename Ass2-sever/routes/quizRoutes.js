const express = require("express");
const router = express.Router();
const controller = require("../controllers/quizController");
const { verifyUser, verifyAdmin } = require("../authenticate");

router.get("/", controller.getAllQuizzes);
router.post("/", verifyUser, verifyAdmin, controller.createQuiz);
router.delete("/", verifyUser, verifyAdmin, controller.deleteAllQuizzes); // Must be before /:id
router.get("/:id", controller.getQuizById);
router.put("/:id", verifyUser, verifyAdmin, controller.updateQuizById);
router.delete("/:id", verifyUser, verifyAdmin, controller.deleteQuizById);

router.post("/:id/question", verifyUser, verifyAdmin, controller.addQuestionToQuiz);
router.post("/:id/questions", verifyUser, verifyAdmin, controller.addMultipleQuestions);
router.get("/:id/populate", controller.getQuizWithCapitalQuestions);
module.exports = router;