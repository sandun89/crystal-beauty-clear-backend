import express from "express";
import {
  getAllUsers,
  loginUser,
  saveUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", saveUser); //save user
userRouter.post("/login", loginUser); //login user
userRouter.get("/all", getAllUsers); //get all users

export default userRouter;
