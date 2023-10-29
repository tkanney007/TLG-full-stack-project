const bcrypt = require("bcrypt");
const saltRounds = 5;
const jwt = require("jsonwebtoken");
const budgetModel = require("../models/budgetModel");
const secretKey = "asdfasdfxfvsdfasdgffsdfgsfa";

const registerUser = async (req, res) => {
  try {
    let hashPass;
    bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
      if (err) {
        console.log(err);
        return;
      }

      console.log("This is the hashed password: ", hash);
      const newUser = {
        email: req.body.email,
        budget_name: req.body.budget_name,
        password: hash,
      };
      //user.push(newUser);
      await budgetModel.create(newUser);

      const result = await budgetModel.findOne({
        where: { email: newUser.email },
        attributes: ["id", "email"],
      });
      if (result != null) {
        let token = jwt.sign(req.body.email, secretKey);
        res.json({
          result,
          token,
        });
        return;
      }
    });
  } catch (error) {
    res.send(error).status(500);
  }
};

module.exports = { registerUser };
