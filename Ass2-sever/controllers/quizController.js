const Question = require("../models/Question");
const Quiz = require("../models/Quiz");


exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate("question");
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.createQuiz = async (req, res) => {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
};


exports.getQuizById = async (req, res) => {
    const quiz = await Quiz.findById(req.params.id).populate("question");
    if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
};


exports.updateQuizById = async (req, res) => {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("question");
    if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
}


exports.deleteQuizById = async (req, res) => {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
    } 
    await Question.deleteMany({ _id: { $in: quiz.question } });
    res.json({ message: "Quiz deleted successfully" });
};

exports.deleteAllQuizzes = async (req, res) => {
    await Quiz.deleteMany({});
    await Question.deleteMany({});
    res.json({ message: "All quizzes deleted successfully" });
};


exports.addQuestionToQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            throw new Error("Quiz not found");
        } 
        const newQuestion = new Question(req.body);

        await newQuestion.save();
            quiz.question.push(newQuestion._id);
        await quiz.save();  
        res.status(201).json(newQuestion);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addMultipleQuestions = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            throw new Error("Quiz not found");
        }
        const questionsDate = req.body; // Expecting an array of question objects
        const createdQuestions = await Question.insertMany(questionsDate);
        createdQuestions.forEach(question => {
            quiz.question.push(question._id);
        });
        await quiz.save();
        res.status(201).json(createdQuestions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};  

exports.getQuizWithCapitalQuestions = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        const keyword = req.query.keyword;
        
        const questions = await Question.find({
            _id: { $in: quiz.question },
            keyword: { $in: [keyword] }
        });

        res.status(200).json({
            _id: quiz._id,
            title: quiz.title,
            description: quiz.description,
            questions: questions,
            count: questions.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
};