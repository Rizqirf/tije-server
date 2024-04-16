const express = require("express");
const router = express.Router();

const auth = require("./auth");
const user = require("./user");
const news = require("./news");
const busStop = require("./bus-stop");
const direction = require("./direction");
const bus = require("./bus");

router.use("/auth", auth);
router.use("/user", user);

router.use("/news", news);
router.use("/bus-stop", busStop);
router.use("/bus", bus);
router.use("/direction", direction);

module.exports = router;
