const sharp = require("sharp");
const User = require("../models/users");
// const { sendWelcomeEmail, sendCancelationEmail } = require("../email/account");
const { errMessage, successMessage } = require("../helper/resmessage");

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("user not found");
    }
    res.json({ data: user, message: successMessage() });
  } catch (e) {
    res.status(404).json();
  }
};

const uploadProfileImage = async (req, res) => {
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();
  req.user.avatar = buffer;
  await req.user.save();
  res.json({ message: successMessage("Profile Uploaded ") });
};

const deleteProfileImage = async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.json({ message: successMessage("Profile Deleted ") });
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.json({ data: user.avatar, message: successMessage() });
  } catch (e) {
    res.status(404).json();
  }
};

const updateUser = async (req, res) => {
  // take all keys from request and retrn an array
  const { password } = req.body;

  if (password) {
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password should be min 6 characters long",
      });
    }
  }

  const updates = Object.keys(req.body);
  const allowedUpdates = ["firstname", "lastname", "password", "mobile"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({
      message: errMessage("upload not succesfull some feild are required"),
    });
  }

  try {
    const user = await User.findOne({ _id: req.user._id });
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    res.json({ data: user });
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    await req.user.remove();
    //   email for cancellation
    // sendCancelationEmail(req.user.email, req.user.name);
    res.json({ data: req.user });
  } catch (e) {
    res.status(500).json(e);
  }
};

module.exports = {
  uploadProfileImage,
  deleteProfileImage,
  getUserProfile,
  getCurrentUser,
  updateUser,
  deleteUser,
};
