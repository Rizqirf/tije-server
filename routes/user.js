const express = require("express");
const {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
} = require("../controller/user");
const router = express.Router();

router.get("/", getAllUsers);

router.delete("/:id", deleteUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);

module.exports = router;
