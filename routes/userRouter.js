import express from "express";
import {
  changePassword,
  getAllUsers,
  getCurrentUser,
  googleLogin,
  loginUser,
  saveUser,
  sendOtp,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", saveUser); //save user
userRouter.post("/login", loginUser); //login user
userRouter.post("/google", googleLogin); //login using google
userRouter.get("/current", getCurrentUser); //get current user details
userRouter.post("/send_otp", sendOtp);
userRouter.post("/change_pass", changePassword);
userRouter.get("/all", getAllUsers); //get all users

export default userRouter;
