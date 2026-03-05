
// sever.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import routes
const quizRoutes = require("./routes/quizRoutes");
const questionRoutes = require("./routes/questionRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

// Initialize express app and connect to database
const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Use routes
app.use("/quizzes", quizRoutes);
app.use("/questions", questionRoutes);
app.use("/users", userRoutes);
app.use("/", authRoutes);
// Start the server
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
