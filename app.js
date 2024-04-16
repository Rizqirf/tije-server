const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const app = express();

const errorHandler = require("./middleware/errorHandler");
const user = require("./models/user");
const routes = require("./routes");

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

app.use("/", routes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
