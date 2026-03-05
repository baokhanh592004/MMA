const express = require("express");
const router = express.Router();
const axios = require("./_axios");

// List
router.get("/", async (req, res) => {
  try {
    const { data } = await axios.get("/quizzes");
    res.render("quiz/list.ejs", { quizzes: data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching quizzes");
  }
});

// Create form - chỉ tạo quiz với title và description
router.get("/new", (req, res) => {
  res.render("quiz/create.ejs");
});

// Create - chỉ tạo quiz, không có question
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    await axios.post("/quizzes", {
      title,
      description,
      question: []
    });

    res.redirect("/quizzes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating quiz");
  }
});

// Detail
router.get("/:id", async (req, res) => {
  try {
    const { data } = await axios.get(`/quizzes/${req.params.id}`);
    res.render("quiz/detail.ejs", { quiz: data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching quiz");
  }
});

// Form thêm question mới vào quiz
router.get("/:id/add-question", async (req, res) => {
  try {
    const { data } = await axios.get(`/quizzes/${req.params.id}`);
    res.render("quiz/add-question.ejs", { quiz: data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching quiz");
  }
});

// Thêm question mới vào quiz (POST /quizzes/:id/question)
router.post("/:id/question", async (req, res) => {
  try {
    const { text, options, keyword, correctAnswerIndex } = req.body;

    await axios.post(`/quizzes/${req.params.id}/question`, {
      text,
      options: options.split(",").map(o => o.trim()).filter(o => o),
      keyword: keyword.split(",").map(k => k.trim()).filter(k => k),
      correctAnswerIndex: parseInt(correctAnswerIndex)
    });

    res.redirect(`/quizzes/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding question to quiz");
  }
});

// Form thêm nhiều questions vào quiz
router.get("/:id/add-questions", async (req, res) => {
  try {
    const { data } = await axios.get(`/quizzes/${req.params.id}`);
    res.render("quiz/add-questions.ejs", { quiz: data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching quiz");
  }
});

// Thêm nhiều questions vào quiz (POST /quizzes/:id/questions)
router.post("/:id/questions", async (req, res) => {
  try {
    const { questions } = req.body;
    
    if (!questions) {
      return res.status(400).send("No questions provided");
    }

    // Convert object to array and process each question
    const questionsArray = Object.values(questions).map(q => ({
      text: q.text,
      options: q.options.split(",").map(o => o.trim()).filter(o => o),
      keyword: q.keyword.split(",").map(k => k.trim()).filter(k => k),
      correctAnswerIndex: parseInt(q.correctAnswerIndex)
    }));

    await axios.post(`/quizzes/${req.params.id}/questions`, questionsArray);

    res.redirect(`/quizzes/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding multiple questions to quiz: " + err.message);
  }
});

// Edit form
router.get("/:id/edit", async (req, res) => {
  try {
    const { data } = await axios.get(`/quizzes/${req.params.id}`);
    res.render("quiz/edit.ejs", { quiz: data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching quiz");
  }
});

// Update - chỉ update title và description
router.put("/:id", async (req, res) => {
  try {
    const { title, description } = req.body;

    await axios.put(`/quizzes/${req.params.id}`, {
      title,
      description
    });

    res.redirect("/quizzes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating quiz");
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    await axios.delete(`/quizzes/${req.params.id}`);
    res.redirect("/quizzes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting quiz");
  }
});

module.exports = router;
