const express = require("express");
const router = express.Router();

const auth = require("./auth");
const user = require("./user");
const news = require("./news");

router.use("/auth", auth);
router.use("/user", user);

router.use("/news", news);

module.exports = router;
