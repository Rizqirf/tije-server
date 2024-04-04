const express = require("express");
const cors = require("cors");
const app = express();

const auth = require("./routes/auth");
const errorHandler = require("./middleware/errorHandler");
const { configureGoogleAuth } = require("./helpers/googleAuth");
const user = require("./models/user");

const port = process.env.PORT || 3000;

// configureGoogleAuth();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use("/auth", auth);
app.use("/user", user);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
