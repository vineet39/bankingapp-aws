import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const getUsers = async () => {
  try {
    const users = await User.find();
    return { message: "Users found", users, error: null, status: 200 };
  } catch (error) {
    return { message: "Users not found", users: null, error, status: 500 };
  }
};

export const getUser = async (accountNumber) => {
  try {
    const user = await User.find({ accountNumber }).select("balance email");
    return { message: "User found", user: user, error: null, status: 200 };
  } catch (error) {
    return { message: "User not found", users: null, error, status: 500 };
  }
};

export const createUser = async (email, name, password) => {
  try {
    const existingUser = await User.findOne({ email });

    console.log(existingUser);
    if (existingUser != null) {
      return {
        message: "Email already in use",
        user: null,
        error:null,
        status: 200,
      };
    }

    let accountNumber = "";
    for (let i = 0; i < 10; i++) {
      accountNumber += Math.floor(Math.random() * 10);
    }

    const user = new User({
      email,
      name,
      password,
      accountNumber
    });

    await user.save();
    return {
      message: "User created successfully",
      user,
      error:null,
      status: 201,
    };
  } catch (error) {
    return {
      message: "Error creating user",
      user:null,
      error:error,
      status: 500,
    };
  }
};

export const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        message: "User not found",
        token: null,
        error: null,
        status: 404,
      };
    }

    const isMatch = password == user.password;
    if (!isMatch) {
      return {
        message: "Invalid credentials",
        token: null,
        error: null,
        status: 400,
      };
    }
    const { accountNumber } = user;
    const token = jwt.sign({ accountNumber }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return { message: "Login Successful", token, error: null, status: 200 };
  } catch (error) {
    return {
      message: "Error logging in: " + error.message,
      token: null,
      error: error,
      status: 500,
    };
  }
};
