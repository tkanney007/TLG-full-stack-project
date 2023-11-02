const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const Budget = require("../models/budgetModel");
const {
  throwError,
  throwIf,
  sendSuccess,
  sendError,
} = require("./errorHandling");

const loginUser = async (req, res) => {
  try {
    const loginResult = await userModel
      .findOne({
        where: { email: req.body.email },
        attributes: [["id", "user_id"], "name", "email", "password"],
        include: {
          model: Budget,
          attributes: ["id", "budget_name"],
        },
      })
      .then(
        throwIf(
          (r) => !r,
          401,
          "not found",
          "There was an issue while trying to retrieve the account."
        ),
        throwError(500, "sequelize error")
      );
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
      loginResult,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "An error occurred while trying to log you in. Please try again.",
    });
  }
};

module.exports = { loginUser };
