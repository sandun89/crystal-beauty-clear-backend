import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productId:{
        type: String,
        required: true
    }
})