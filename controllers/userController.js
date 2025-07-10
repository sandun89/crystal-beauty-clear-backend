import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
import { generateOtp } from "../utils/helperUtil.js";
import { OTP } from "../models/otp.js";
dotenv.config();

const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "spkcreations@gmail.com",
    pass: process.env.GOOGLE_APP_PASS,
  },
});

export function saveUser(req, res) {
  //if trying to create an admin check conditions
  if (req.body.role == "admin") {
    //check user logged or not
    if (req.user == null) {
      res.status(403).json({
        message: "Please login as admin before creating an admin account",
      });
      return;
    }

    //checked logged user role is admin or not
    if (req.user.role != "admin") {
      res.status(403).json({
        message: "You are not authorized to create admin account",
      });
      return;
    }
  }

  //generate hashpassword
  const hashPassword = bcrypt.hashSync(req.body.password, 10);

  //create user data object
  const user = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hashPassword,
    role: req.body.role,
  });

  //save user
  user
    .save()
    .then(() => {
      res.status(200).json({
        message: "User saved successfully",
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "User not saved",
      });
    });
}

export function updateUser(req, res) {
  if (req.user == null) {
    res.status(403).json({
      message: "User must login to continue",
    });
    return;
  }

  if (req.user.role == "admin") {
    User.findOneAndUpdate(
      {
        email: req.body.email,
      },
      req.body
    )
      .then(() => {
        res.json({
          message: "User updated successfully",
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "User not updated",
        });
      });
  } else {
    res.status(403).json({
      message: "Please login as admin before update user",
    });
  }
}

export function loginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
    email: email,
  }).then((user) => {
    if (user == null) {
      res.status(401).json({
        message: "Invalid Email",
      });
    } else {
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (isPasswordCorrect) {
        //create userdata object
        const userData = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          isDisabled: user.isDisabled,
          isEmailVerified: user.isEmailVerified,
        };

        const token = jwt.sign(userData, process.env.JWT_KEY);
        res.json({
          message: "Login successful",
          token: token,
          user: userData,
        });
      } else {
        res.status(403).json({
          message: "Invalid password",
        });
      }
    }
  });
}

export function getAllUsers(req, res) {
  console.log(req.body);
  if (req.user == null) {
    res.status(403).json({
      message: "User must login to continue",
    });
    return;
  }

  if (req.user.role == "admin") {
    User.find({})
      .then((users) => {
        res.json({
          message: "All users fetched",
          userList: users,
        });
      })
      .catch(() => {
        res.status(403).json({
          message: "Something went wrong",
        });
      });
  } else {
    res.status(403).json({
      message: "Please login as admin before get all user details",
    });
  }
}

export async function googleLogin(req, res) {
  const accessToken = req.body.accessToken;
  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    const user = await User.findOne({
      email: response.data.email,
    });

    if (user == null) {
      const userData = {
        email: response.data.email,
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        role: "user",
        phone: "Not Given",
        isDisabled: false,
        isEmailVerified: true,
        password: accessToken,
      };

      const newUser = new User(userData);
      await newUser.save();

      const token = jwt.sign(userData, process.env.JWT_KEY, {
        expiresIn: "48hrs",
      });

      res.json({
        message: "Login Successfull",
        token: token,
        user: userData,
      });
    } else {
      const userData = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        isDisabled: user.isDisabled,
        isEmailVerified: user.isEmailVerified,
      };

      const token = jwt.sign(userData, process.env.JWT_KEY, {
        expiresIn: "48hrs",
      });

      res.json({
        message: "Login Successfull",
        token: token,
        user: userData,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Google Login Failed",
    });
  }
}

export async function getCurrentUser(req, res) {
  if (req.user == null) {
    res.status(403).json({
      message: "Please Login to get User Details",
    });
    return;
  }
  res.json({
    user: req.user,
  });
}

export async function sendOtp(req, res) {
  const email = req.body.email;
  const otp = generateOtp();
  const message = {
    from: "spkcreations@gmail.com",
    to: email,
    subject: "OTP for Email Verification",
    text: "Your OTP is : " + otp,
  };

  const newOtp = new OTP({
    email: email,
    otp: otp,
  });

  newOtp.save().then(() => {
    console.log("OTP Saved Successfully");
  });

  transport.sendMail(message, (error, info) => {
    if (error) {
      res.status(500).json({
        message: "Error Sending Email",
      });
    } else {
      res.json({
        message: "OTP Sent Successfully",
        otp: otp,
      });
    }
  });
}

export async function changePassword(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const otp = req.body.otp;

  try {
    const lastOtpData = await OTP.findOne({
      email: email,
    }).sort({ dateCreated: -1 });

    if (lastOtpData == null) {
      res.status(404).json({
        message: "No OTP Data Found for this Email",
      });
      return;
    }

    if (lastOtpData.otp != otp) {
      res.status(404).json({
        message: "Invalid OTP",
      });
      return;
    }

    const hashPassword = bcrypt.hashSync(password, 10);
    await User.updateOne({ email: email }, { password: hashPassword });
    await OTP.deleteMany({ email: email });
    res.json({
      message: "Password Changed Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Changing Password",
    });
  }
}
