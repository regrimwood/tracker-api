require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./router");

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api", router);

module.exports = app;
