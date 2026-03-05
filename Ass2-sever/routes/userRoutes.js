const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyUser, verifyAdmin } = require("../authenticate");

router.get("/", verifyUser, verifyAdmin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router; 