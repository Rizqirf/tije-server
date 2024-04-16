const express = require("express");
const router = express.Router();

const {
  getAllBusStop,
  getBusStopById,
  deleteBusStop,
  updateBusStop,
  createBusStop,
  getNearestBusStop,
} = require("../controller/bus-stop");

const authenticate = require("../middleware/authenticate");

router.get("/", getAllBusStop);
router.get("/:id", getBusStopById);
router.delete("/:id", deleteBusStop);
router.post("/nearest", getNearestBusStop);
router.put("/:id", authenticate, updateBusStop);
router.post("/", authenticate, createBusStop);

module.exports = router;
