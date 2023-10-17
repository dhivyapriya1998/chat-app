const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../data/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, mailId, password, pic } = req.body;

  if (!name || !mailId || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const userExists = await User.findOne({ mailId });

  if (userExists) {
    res.status(400);
    throw new Error("User already exsits!");
  }

  const user = await User.create({
    name,
    mailId,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      mailId: user.mailId,
      pic: user.profilePic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create new User");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { mailId, password } = req.body;

  const user = await User.findOne({ mailId });

  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      mailId: user.mailId,
      pic: user.profilePic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid mail or password");
  }
});

module.exports = { registerUser, authUser };
