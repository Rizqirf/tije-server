const express = require("express");
const router = express.Router();

const {
  getAllNews,
  getNewsById,
  deleteNews,
  updateNews,
  createNews,
} = require("../controller/news");
const authenticate = require("../middleware/authenticate");

router.get("/", getAllNews);
router.get("/:id", getNewsById);

router.use(authenticate);
router.post("/", createNews);
router.put("/:id", updateNews);
router.delete("/:id", deleteNews);

module.exports = router;
