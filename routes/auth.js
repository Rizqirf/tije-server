const express = require("express");
const router = express.Router();
const {
  login,
  register,
  googleSSOlogin,
  verifyEmail,
} = require("../controller/auth");

router.post("/login", login);
router.post("/google-login", googleSSOlogin);

router.post("/register", register);

router.post("/forgot-password", (req, res) => {
  res.json({ message: "forgot password success" });
});

router.get("/verify-email/:code", verifyEmail);

module.exports = router;
