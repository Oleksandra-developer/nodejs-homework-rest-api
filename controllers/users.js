const Users = require("../repositories/users");
const { HttpCode } = require("../helpers/constants");
const jwt = require("jsonwebtoken");
const UploadAvatarService = require("../services/localUpload");
const path = require("path");
const fs = require("fs/promises");
// const jimp = require("jimp");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

const register = async (req, res, next) => {
  console.log(req.body, "request");
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      res.status(HttpCode.CONFLICT).json({
        message: "Email in use",
      });
    }
    const newUser = await Users.create(req.body);
    const id = newUser._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
    res.status(HttpCode.CREATED).json({
      token,
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatar: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    const isValidPassword = await user?.isValidPassword(req.body.password);
    if (!user || !isValidPassword) {
      res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        ResponseBody: {
          message: "Email or password is wrong",
        },
      });
    }

    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
    await Users.updateToken(user._id, token);
    res.status(HttpCode.OK).json({
      token: token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const user = await Users.findById(req.user._id);
    if (!user) {
      res.status(HttpCode.UNAUTHORIZED).json({
        message: "Not authorized",
      });
    }
    await Users.updateToken(req.user._id, null);
    res.status(HttpCode.NO_CONTENT).json({});
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  try {
    res.status(HttpCode.OK).json({
      email: req.user.email,
      subscription: req.user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

const newAvatar = async (req, res, next) => {
  try {
    const id = req.user._id;
    const uploads = new UploadAvatarService(
      process.env.AVATARS_FOR_PUBLICATION
    );
    const avatarUrl = await uploads.saveAvatar({ userId: id, file: req.file });
    try {
      await fs.unlink(
        path.join(process.env.AVATARS_FOR_PUBLICATION, req.user.avatar)
      );
    } catch (e) {
      console.log(e.message);
    }
    await Users.updateAvatar(id, avatarUrl);
    res.status(HttpCode.OK).json({ avatarURL: avatarUrl });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  register,
  login,
  logout,
  current,
  newAvatar,
};
