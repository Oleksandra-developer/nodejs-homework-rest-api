const Users = require("../repositories/users");
const { HttpCode } = require("../helpers/constants");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs/promises");
const jimp = require("jimp");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
const sendEmail = require("../helpers/sendMail");

const register = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        message: "Email in use",
      });
    }
    const newUser = await Users.create(req.body);
    const verificationToken = res.verificationToken;
    const email = {
      to: req.body.email,
      subject: "Подтверждение",
      html: `<a href="http://localhost:3000/users/verify/${verificationToken}">Подтвердите регистрацию</a>`,
    };
    await sendEmail(email);

    return res.status(HttpCode.CREATED).json({
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
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        ResponseBody: {
          message: "Email or password is wrong",
        },
      });
    }
    if (!user.verify) {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: "error",
        code: HttpCode.BAD_REQUEST,
        ResponseBody: {
          message: "Email is not confirmed",
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

const updateAvatar = async (req, res, next) => {
  const id = req.user._id.toString();
  const fileName = req.file.originalname.split(".");
  const ext = fileName[fileName.length - 1];
  const publicAvatar = path.join(
    process.env.AVATARS_FOR_PUBLICATION + id + "." + ext
  );
  if (!req.user) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      message: "Not authorized",
    });
  }
  try {
    const file = await jimp.read(req.file.path);
    await file
      .autocrop()
      .cover(
        250,
        250,
        jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(publicAvatar);
    await fs.unlink(req.file.path);
    return res.status(HttpCode.OK).json({
      avatarURL: `/avatars/${id}.${ext}`,
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await Users.findByVerifyToken(verificationToken);
    if (!user) {
      return res.status(HttpCode.NOT_FOUND).json({
        message: "User not found",
      });
    }

    await Users.updateVerifyToken(user._id);
    return res.status(HttpCode.OK).json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

const repeated = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({ message: "missing required field email" });
    }
    const user = await Users.findByEmail(email);
    if (user.verify === true) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({ message: "Verification has already been passed" });
    }
    if (user.verify === false || email) {
      const verificationToken = user.verificationToken;
      const emailData = {
        to: email,
        subject: "Повторное подтверждение",
        html: `<a href="http://localhost:3000/users/verify/${verificationToken}">Подтвердите регистрацию</a>`,
      };
      await sendEmail(emailData);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  current,
  updateAvatar,
  verify,
  repeated,
};
