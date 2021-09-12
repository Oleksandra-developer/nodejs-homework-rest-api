const Users = require("../repositories/users");
const { HttpCode } = require("../helpers/constants");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

const register = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Email in use",
      });
    }
    const newUser = await Users.create(req.body);
    res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    const isValidPassport = await user?.isValidPassword(req.body.password);
    if (!user || !isValidPassport) {
      res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        ResponseBody: {
          message: "Email or password is wrong",
        },
      });
    }
    const id = user.id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
    await Users.updateToken(id, token);
    res.json({
      status: "success",
      code: 200,
      ResponseBody: {
        token: token,
        user: {
          id,
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const id = req.body.id;
    await Users.updateToken(id, null);
    res.status(HttpCode.NO_CONTENT).json({});
  } catch (error) {
    next(error);
  }
};
// /users/current - проверка по токену

const token = async (req, res, next) => {
  try {
    const contacts = await Users.listContacts();
    res.json({
      status: "success",
      code: 200,
      data: {
        result: contacts,
      },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  register,
  token,
  login,
  logout,
};
