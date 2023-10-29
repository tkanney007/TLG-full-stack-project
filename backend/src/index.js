const express = require("express");
const app = express();
const port = 3001;
const loginRoute = require("./routes/loginRoutes");
const registerRoute = require("./routes/registerRoutes");

app.use(express.json());
app.use("/register", registerRoute);
app.use("/login", loginRoute);

app.listen(port, () => {
  console.log(`App listening on port ${port}...`);
});
