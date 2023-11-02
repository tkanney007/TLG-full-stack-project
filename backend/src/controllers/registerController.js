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
const secretKey = "asdfasdfxfvsdfasdgffsdfgsfa";
//const { sequelize } = require("../models/conn");

const registerUser = async (req, res) => {
  try {
    //let hashPass;
    bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
      try {
        if (err) {
          console.log(err);
          return;
        }

        console.log("This is the hashed password: ", hash);
        const newUser = {
          name: req.body.name,
          email: req.body.email,
          password: hash,
        };
        //user.push(newUser);
        //const t = await sequelize.transaction();
        await userModel.create(newUser).then(
          throwIf(
            (r) => !r,
            400,
            "request error",
            "Account already exists with the provided email."
          ),
          throwError(500, "sequelize error")
        );

        //await t.commit();

        const result = await userModel
          .findOne({
            where: { email: newUser.email },
            attributes: ["id", "name", "email"],
          })
          .then(
            throwIf(
              (r) => !r,
              400,
              "not found",
              "Account was created but could not be fetched from the database."
            ),
            throwError(500, "sequelize error")
          );

        if (result != null) {
          let token = await jwt.sign(req.body.email, secretKey);
          sendSuccess(res, "User account created successfully!")(result);
          // return res.status(200).json({
          //   result,
          //   message: "User account created successfully!",
          //   // token,
          // });
        }
        // return res.status(401).json({
        //   message: "Registration unsuccessful, please try again.",
        // });
      } catch (error) {
        sendError(res, 500)(error);
        console.log(`******THEE error message: ${error.message}`);
        //res.status(500).json(error.message);
      }
    });
    // .then(
    //   throwIf((r) => !r, 400, "request error", "Password encryption failed."),
    //   throwError()(error)
    // );
  } catch (error) {
    sendError(res, 500)(error);
  }
};

module.exports = { registerUser };
