const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Question = require("./models/Question");

exports.verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.id);
    req.user = user;
    next();
  });
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    return res.status(403).json({
      message: "You are not authorized to perform this operation!"
    });
  }
};

exports.verifyAuthor = async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  // Admin có thể xóa/sửa bất kỳ question nào
  if (req.user.admin) {
    return next();
  }

  // Question cũ không có author → không ai được phép sửa/xóa (trừ admin)
  if (!question.author) {
    return res.status(403).json({
      message: "This question has no author assigned"
    });
  }

  if (question.author.toString() === req.user._id.toString()) {
    next();
  } else {
    return res.status(403).json({
      message: "You are not the author of this question"
    });
  }
};