import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: "String",
        required: true
    },
    otp: {
        type: "string",
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

export const OTP = mongoose.model("otp", otpSchema);