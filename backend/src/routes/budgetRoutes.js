const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/loginController");

router.post("/", getAllBudgets);

module.exports = router;
