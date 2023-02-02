const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
exports.signUp = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const hashpassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({ username, password: hashpassword });
    res.status(201).json({
      status: "success",
      data: { user: newUser },
    });
  } catch (error) {
    return res.status(400).json({ status: error });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "user not found" });
    }
    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect) {
      return res
        .status(403)
        .json({ status: "failed", message: "password incorrect" });
    }

    return res.status(200).json({ status: "success" });
  } catch (error) {
    return res.status(400).json({ status: error });
  }
};
