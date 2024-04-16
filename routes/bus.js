const express = require("express");
const router = express.Router();

const { getAllBus } = require("../controller/bus");

router.get("/", getAllBus);

module.exports = router;
