const { User } = require("../models");

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findOne({
    where: {
      user_token: token,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = user;
  next();
};

module.exports = authenticate;
