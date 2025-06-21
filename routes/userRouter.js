import express from "express";
import {
  getAllUsers,
  getCurrentUser,
  googleLogin,
  loginUser,
  saveUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", saveUser); //save user
userRouter.post("/login", loginUser); //login user
userRouter.post("/google", googleLogin); //login using google
userRouter.get("/current", getCurrentUser); //get current user details
userRouter.get("/all", getAllUsers); //get all users

export default userRouter;
