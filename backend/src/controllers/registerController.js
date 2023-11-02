const bcrypt = require("bcrypt");
const saltRounds = 5;
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const {
  throwError,
  throwIf,
  sendSuccess,
  sendError,
} = require("./errorHandling");

const registerUser = async (req, res) => {
  try {
    //let hashPass;
    bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
      try {
        if (err) {
          console.log(err);
          return;
        }
        //console.log("This is the hashed password: ", hash);
        const newUser = {
          name: req.body.name,
          email: req.body.email,
          password: hash,
        };

        await userModel.create(newUser).then(
          throwIf(
            (r) => !r,
            400,
            "request error",
            "Account already exists with the provided email."
          ),
          throwError(500, "sequelize error")
        );

        await userModel
          .findOne({
            where: { email: newUser.email },
            attributes: ["id", "name", "email"],
          })
          .then((user) => {
            if (!user)
              return res.status(400).json({
                success: false,
                message: `User account not found for email address: ${user.email} after creation`,
              });
            else {
              return res.status(200).json({
                success: true,
                message: "Account registration successful!",
                user,
              });
            }
          });
      } catch (error) {
        sendError(res, 500)(error);
        console.log(`******Error message: ${error.message}`);
        //res.status(500).json(error.message);
      }
    });
  } catch (error) {
    sendError(res, 500)(error);
    console.log(`******Error message: ${error.message}`);
  }
};

module.exports = { registerUser };
