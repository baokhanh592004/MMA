const Question = require("../models/Question");


exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getQuestionById = async (req, res) => {
    const question = await Question.findById(req.params.id);
    if (!question) {
        return res.status(404).json({ message: "Question not found" });
    }
    res.json(question);
};

exports.updateQuestionById = async (req, res) => {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!question) {
        return res.status(404).json({ message: "Question not found" });
    }
    res.json(question);
}


exports.deleteQuestionById = async (req, res) => {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
        return res.status(404).json({ message: "Question not found" });
    }
    res.json({ message: "Question deleted successfully" });
};


exports.deleteAllQuestions = async (req, res) => {
    await Question.deleteMany();
    res.json({ message: "All questions deleted successfully" });
};

exports.createQuestion = async (req, res) => {
  const question = await Question.create({
    ...req.body,
    author: req.user._id
  });

  res.status(201).json(question);
};