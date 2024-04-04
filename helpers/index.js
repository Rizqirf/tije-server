const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const passHass = (pass) => bcrypt.hashSync(pass, 10);
const comparePass = (pass, hashed) => bcrypt.compareSync(pass, hashed, 10);

const createToken = (payload) => jwt.sign(payload, "rahasia");
const verifyToken = (token) => jwt.verify(token, "rahasia");

module.exports = { passHass, comparePass, createToken, verifyToken };
