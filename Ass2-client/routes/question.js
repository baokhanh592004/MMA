const express = require("express");
const router = express.Router();
const axios = require("./_axios");

// List
router.get("/", async (req, res) => {
  try {
    const { data } = await axios.get("/questions");
    res.render("question/list.ejs", { questions: data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching questions");
  }
});

// Create form
router.get("/new", (req, res) => {
  res.render("question/create.ejs");
});

// Create
router.post("/", async (req, res) => {
  try {
    const { text, options, keyword, correctAnswerIndex } = req.body;

    await axios.post("/questions", {
      text,
      options: options.split(",").map(o => o.trim()).filter(o => o),
      keyword: keyword.split(",").map(k => k.trim()).filter(k => k),
      correctAnswerIndex: parseInt(correctAnswerIndex)
    });

    res.redirect("/questions");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating question");
  }
});

// Detail
router.get("/:id", async (req, res) => {
  try {
    const { data } = await axios.get(`/questions/${req.params.id}`);
    res.render("question/detail.ejs", { q: data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching question");
  }
});

// Edit form
router.get("/:id/edit", async (req, res) => {
  try {
    const { data } = await axios.get(`/questions/${req.params.id}`);
    res.render("question/edit.ejs", { q: data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching question");
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const { text, options, keyword, correctAnswerIndex } = req.body;

    await axios.put(`/questions/${req.params.id}`, {
      text,
      options: options.split(",").map(o => o.trim()).filter(o => o),
      keyword: keyword.split(",").map(k => k.trim()).filter(k => k),
      correctAnswerIndex: parseInt(correctAnswerIndex)
    });

    res.redirect("/questions");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating question");
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    await axios.delete(`/questions/${req.params.id}`);
    res.redirect("/questions");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting question");
  }
});

module.exports = router;
