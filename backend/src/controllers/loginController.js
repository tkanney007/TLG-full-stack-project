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
const secretKey = "asdfasdfxfvsdfasdgffsdfgsfa";

const loginUser = async (req, res) => {
  try {
    await userModel
      .findOne({
        where: { email: req.body.email },
        attributes: [["id", "user_id"], "name", "email", "password"],
        include: {
          model: Budget,
          attributes: [["id", "budget_id"], "budget_name"],
        },
      })
      .then((user) => {
        //If user account doesn't exist them return status 400
        if (!user)
          return res.status(400).json({ message: "Email address not found." });
        //if user found with email address then compare password
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            throw err;
          }
          if (result) {
            let token = jwt.sign(user.email, secretKey);
            res.status(200).json({
              success: true,
              message: "You have successfully logged in.",
              token,
              user,
            });
          } else {
            res
              .status(401)
              .json({ success: false, message: "Password incorrect." });
          }
        });
      });
  } catch (error) {
    sendError(res, 500)(error);
  }
};

module.exports = { loginUser };
