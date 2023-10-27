const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const budgetModel = require("../models/budgetModel");
const userModel = require("../models/userModel");
const Budget = require("../models/budgetModel");

const secretKey = "asdfasdfxfvsdfasdgffsdfgsfa";

const loginUser = async (req, res) => {
  try {
    let token = jwt.verify(req.body.token, secretKey, (err, result) => {
      if (err) {
        console.log(err);
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
    });
    const loginResult = await userModel.findOne({
      where: { email: req.body.email },
      attributes: ["id", "first_name", "email", "password"],
      include: {
        model: Budget,
        attributes: ["id", "budget_name"],
      },
    });
    if (!loginResult) {
      res.status(401).json({ message: "Email address not found." });
      return;
    }
    if (!bcrypt.compare(req.body.password, loginResult.password)) {
      res.status(401).json({ message: "Password incorrect." });
      return;
    }

    res.status(200).json({
      message: "You have successfully logged in.",
      id: loginResult.id,
      first_name: loginResult.first_name,
      email: loginResult.email,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occurred while trying to log you in. Please try again.",
    });
  }
};

module.exports = { loginUser };
