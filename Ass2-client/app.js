const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const { engine } = require("express-handlebars");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

// Handlebars (layout chính)
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", "./views");

// EJS for specific pages (question and quiz)
app.engine("ejs", require("ejs").renderFile);

// Routes
app.use("/questions", require("./routes/question"));
app.use("/quizzes", require("./routes/quizzes"));

app.get("/", (req, res) => res.redirect("/quizzes"));

app.listen(3000, () =>
  console.log("UI running at http://localhost:3000")
);
