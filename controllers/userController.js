import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function saveUser(req, res){

    //if trying to create an admin check conditions
    if(req.body.role == "admin"){

        //check user logged or not
        if(req.user == null){ 
            res.status(403).json({
                message: "Please login as admin before creating an admin account"
            });
            return;
        }

        //checked logged user role is admin or not
        if(req.user.role != "admin"){
            res.status(403).json({
                message: "You are not authorized to create admin account"
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
        role: req.body.role
    });

    //save user
    user.save().then(()=>{
        res.status(200).json({
            message: "User saved successfully"
        });
    }).catch(()=>{
        res.status(500).json({
            message: "User not saved"
        });
    });
}

export function loginUser(req, res){
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email: email
    }).then((user)=>{
        if(user == null){
            res.status(404).json({
                message:"Invalid Email"
            })
        } else {
            const isPasswordCorrect = bcrypt.compareSync(password, user.password);
            if (isPasswordCorrect){

                //create userdata object
                const userData = {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    phone: user.phone,
                    isDisabled: user.isDisabled,
                    isEmailVerified: user.isEmailVerified
                }

                const token = jwt.sign(userData, "tokenKey");
                res.json({
                    message: "Login successful",
                    token: token
                })
            } else {
                res.status(403).json({
                    message:"Invalid password"
                });
            }
        }
    });
}

export function getAllUsers(req, res){
    if (req.user == null){
        res.status(403).json({
            message: "User must login to continue"
        })
        return;
    }

    if (req.user.role == "admin") {
        User.find({}).then((users)=>{
            res.json({
                message: "All users fetched",
                userList: users
            })
        }).catch(()=>{
            res.status(403).json({
                message: "Something went wrong"
            })
        })
    } else {
        res.status(403).json({
            message: "Please login as admin before get all user details"
        });
    }
}
