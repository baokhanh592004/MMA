const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    options: [{ type: String, required: true}],
    keyword : [{ type: String, required: true }],
    correctAnswerIndex: { type: Number, required: true },

    author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Question", questionSchema);