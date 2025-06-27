import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    review: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: [0, "Rating Cannot be Negative"],
        max: [5, "Rating Cannot Exceed 5"],
        default: 0
    }
});

const Review = mongoose.model("review", reviewSchema);
export default Review