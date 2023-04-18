import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";

//register a new user
export const registerUser = async (req, res) => {
  const { username, password, firstname, lastname } = req.body;
  //password hashing
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new UserModel({
    username,
    password: hashedPassword,
    firstname,
    lastname,
  });
  try {
    await newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//login a user
export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const findUser = await UserModel.findOne({ username: username });
    if (findUser) {
      const checkPassword = await bcrypt.compare(password, findUser.password);
      checkPassword
        ? res.status(200).json(findUser)
        : res.status(400).json("Wrong password");
    } else {
      res.status(404).json("User does not exist");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
