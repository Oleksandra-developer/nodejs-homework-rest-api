const User = require("../model/user");

const findById = async (id) => {
  return await User.findById(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const create = async (body) => {
  const user = new User(body);
  user.createVerifyToken();
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};
const updateVerifyToken = async (id) => {
  return await User.findByIdAndUpdate(
    { _id: id },
    { verifyToken: null, verify: true }
  );
};

const updateAvatar = async (id, avatar) => {
  return await User.updateOne({ _id: id }, { avatar });
};

const findByVerifyToken = async (verifyToken) => {
  return await User.findOne({ verifyToken });
};

module.exports = {
  findById,
  findByEmail,
  create,
  updateToken,
  updateAvatar,
  findByVerifyToken,
  updateVerifyToken,
};
