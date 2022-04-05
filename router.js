const express = require("express");
const repository = require("./repository");
const router = express.Router();
const { getData } = require("./repository");

router.get("/", async (req, res, next) => {
  try {
    const result = await getData();
    return res.json(result);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { mood } = req.query;
    console.log(mood);
    const newEntry = await repository.createNewEntry(mood);
    return res.status(201).send(newEntry);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
