const express = require("express");
const app = express();
const unless = require("express-unless");
const cors = require("cors");
const port = 3001;
const jwt = require("jsonwebtoken");
const loginRoutes = require("./routes/loginRoutes");
const registerRoutes = require("./routes/registerRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const contributorRoutes = require("./routes/contributorRoutes");
const payCheckRoutes = require("./routes/payCheckRoutes");
const billRoutes = require("./routes/billRoutes");
const secretKey = "asdfasdfxfvsdfasdgffsdfgsfa";

app.use(cors());
app.use(express.json());

app
  .use((req, res, next) => {
    jwt.verify(req.body.token, secretKey, (err, result) => {
      if (err) {
        console.log(err);
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      next();
    });
  })
  .unless({ path: ["/register"] });

app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use("/budgets", budgetRoutes);
app.use("/contributors", contributorRoutes);
app.use("/paychecks", payCheckRoutes);
app.use("/bills", billRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}...`);
});
