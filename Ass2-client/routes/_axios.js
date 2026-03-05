// routes/_axios.js
const axios = require("axios");

// Use HTTP since server runs on normal HTTP (change port if needed)
const API_URL = process.env.API_URL || "http://localhost:9999";

module.exports = axios.create({
  baseURL: API_URL
});
