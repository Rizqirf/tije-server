const { comparePass, createToken, verifyToken } = require("../helpers");
const { User } = require("../models");
const { sequelize } = require("../models");
const { Op } = require("sequelize");
const { verifyIdToken } = require("../helpers/googleAuth");
const { generateRandomString } = require("../helpers/otpGenerator");
const { setCache, deleteCache, getCache } = require("../helpers/redis");
const { sendMail } = require("../helpers/nodemailer");
const { verifyGoogleToken } = require("../helpers/googleAuth");

const elapsed = require("elapsed-time-logger");

const login = async (req, res, next) => {
  try {
    const { email = "", password } = req.body;
    if (!email) throw { name: "EMAIL_REQ" };
    if (!password) throw { name: "PASS_REQ" };
    const { dataValues: user } = await User.findOne({
      where: {
        email: {
          [Op.iLike]: email,
        },
      },
    });

    if (!user) throw { name: "UNAUTH" };
    if (!comparePass(password, user.password)) throw { name: "UNAUTH" };

    const tokenExp = new Date();
    tokenExp.setHours(tokenExp.getHours() + 24);

    const token = createToken({
      id: user.id,
      email: user.email,
      token_expiration: tokenExp,
    });

    await User.update(
      { token_expiration: tokenExp, user_token: token, logged_in: true },
      {
        where: { id: user.id },
      }
    );

    const {
      token: tok,
      token_expiration: tokexp,
      password: pass,
      ...filtered
    } = user;

    res.status(200).json({ user: filtered, token });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    elapsed.start("register");
    const { email, password } = req.body;

    const payload = {
      email,
      password,
      is_verified: false,
    };

    elapsed.start("transaction");
    const result = await sequelize.transaction(async () => {
      elapsed.start("findOrCreate");
      const [{ dataValues: user }, created] = await User.findOrCreate({
        where: {
          email,
        },
        defaults: payload,
      });
      elapsed.end("findOrCreate");

      if (!created) {
        throw { name: "ALREADY_EXIST" };
      }

      elapsed.start("createToken");
      const tokenExp = new Date();
      tokenExp.setHours(tokenExp.getHours() + 24);

      const token = createToken({
        id: user.id,
        email: user.email,
        token_expiration: tokenExp,
      });
      elapsed.end("createToken");
      elapsed.start("updateUser");
      await User.update(
        { token_expiration: tokenExp, user_token: token },
        {
          where: { id: user.id },
        }
      );
      elapsed.end("updateUser");

      const {
        token: tok,
        token_expiration: tokexp,
        password: pass,
        user_token,
        ...filtered
      } = user;

      return { user: filtered, token };
    });
    elapsed.end("transaction");
    elapsed.start("sendMail");
    const emailVerificationCode = generateRandomString(25);

    const resp = await setCache(emailVerificationCode, result.user.email, {
      EX: 60 * 60 * 24,
    });

    // send email
    sendMail(result.user.email, "verify", {
      url: `http://localhost:3000/auth/verify-email/${emailVerificationCode}`,
    });
    elapsed.end("sendMail");

    elapsed.end("register");

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) throw { name: "USER_NOT_FOUND" };

    const otp = generateRandomString(6);
  } catch (error) {
    next(error);
  }
};

const googleSSOlogin = async (req, res, next) => {
  try {
    elapsed.start("googleSSOlogin");
    const { idToken } = req.body;
    elapsed.start("verifyGoogleToken");
    const payload = await verifyGoogleToken(idToken);
    elapsed.end("verifyGoogleToken");

    // elapsed.start("findOrCreate");
    // const [{ dataValues: user }, created] = await User.findOrCreate({
    //   where: { email: payload.email },
    //   defaults: {
    //     email: payload.email,
    //     is_verified: true,
    //     name: payload.name,
    //   },
    // });
    // elapsed.end("findOrCreate");

    elapsed.start("findOne");
    let user = await User.findOne({ where: { email: payload.email } });
    elapsed.end("findOne");

    if (!user) {
      elapsed.start("createUser");
      const newUser = await User.create({
        email: payload.email,
        is_verified: true,
        name: payload.name,
      });
      elapsed.end("createUser");
      user = newUser;
    }

    elapsed.start("updateUser");
    const tokenExp = new Date();
    tokenExp.setHours(tokenExp.getHours() + 24);

    const token = createToken({
      id: user.id,
      email: user.email,
      token_expiration: tokenExp,
    });
    await User.update(
      { token_expiration: tokenExp, user_token: token },
      {
        where: { id: user.id },
      }
    );
    elapsed.end("updateUser");

    const {
      token: tok,
      token_expiration: tokexp,
      password: pass,
      user_token,
      ...filtered
    } = user;

    elapsed.end("googleSSOlogin");
    res.status(200).json({ user: filtered, token });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { code } = req.params;
    const email = await getCache(code);
    if (!email) throw { name: "CODE_EXPIRED" };

    const user = await User.findOne({ where: { email } });
    if (!user) throw { name: "USER_NOT_FOUND" };

    await User.update({ is_verified: true }, { where: { email } });

    await deleteCache(code);

    res.status(200).json({ message: "Email verified" });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register, googleSSOlogin, verifyEmail };
