const express = require("express");
const repository = require("./repository");
const router = express.Router();
const { auth } = require("express-oauth2-jwt-bearer");
const { getData } = require("./repository");

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
});

router.get("/", checkJwt, async (req, res, next) => {
  try {
    const result = await getData();
    return res.json(result);
  } catch (e) {
    next(e);
  }
});

router.post("/", checkJwt, async (req, res, next) => {
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
