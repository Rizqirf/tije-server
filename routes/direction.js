const express = require("express");
const router = express.Router();

const { getDirection } = require("../controller/direction");

router.post("/", getDirection);

module.exports = router;
