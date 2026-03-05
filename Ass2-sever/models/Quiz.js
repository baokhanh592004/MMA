const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    title : { type: String, required: true },
    description: String,
    question: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
});

module.exports = mongoose.model("Quiz", questionSchema);