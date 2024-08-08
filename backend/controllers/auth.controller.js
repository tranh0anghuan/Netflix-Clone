import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

//SIGN UP
export async function sigup(req, res) {
  try {
    //Validate
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUserByEmail = await User.findOne({ email: email });

    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exist" });
    }

    const existingUserByUsername = await User.findOne({ username: username });

    if (existingUserByUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exist" });
    }

    // hashing password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // random user avatar
    const PROFILE_PICS = [
      "./assests/avatar1.png",
      "./assests/avatar2.png",
      "./assests/avatar3.png",
    ];
    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    // create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      image,
    });

    //generate token
    generateTokenAndSetCookie(newUser._id, res);
    await newUser.save();

    //remove password from the response
    res.status(201).json({
      success: true,
      user: {
        ...newUser._doc,
        password: "",
      },
    });
  } catch (error) {
    console.log("Error in sign up controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

//LOG IN
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(201).json({
      success: true,
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (error) {
    console.log("Error in sign up controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

//LOG OUT
export async function logout(req, res) {
  try {
    res.clearCookie("jwt-netflix");
    res.status(200).json({ success: true, message: "Log out successfully" });
  } catch (error) {
    console.log("Error in sign up controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
