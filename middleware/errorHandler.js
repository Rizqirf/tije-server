const errorHandler = (error, req, res, next) => {
  console.log(error);
  let err = error.name;
  let code = 500;
  let str = "Internal server error";

  switch (err) {
    case "SequelizeUniqueConstraintError":
    case "SequelizeValidationError":
      code = 400;
      str = error.errors[0].message;
      break;
    case "PASS_REQ":
      code = 400;
      str = "Password is required";
      break;
    case "EMAIL_REQ":
      code = 400;
      str = "Email is required";
      break;
    case "UNAUTH":
      code = 401;
      str = "Invalid email/password";
      break;
    case "INVALID":
    case "JsonWebTokenError":
      code = 401;
      str = "Invalid token";
      break;
  }
  res.status(code).json({ message: str });
};

module.exports = errorHandler;
