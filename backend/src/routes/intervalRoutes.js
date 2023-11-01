const express = require("express");
const router = express.Router();
const { getIntervals } = require("../controllers/intervalController");

router.get("/", getIntervals);

module.exports = router;
