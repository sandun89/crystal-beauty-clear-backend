import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true
    },
    altName: {
        type: [],
        default: []
    },
    price: {
        type: Number,
        required: true
    },
    labledPrice: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: [],
        required: true,
        default: []
    },
    stock: {
        type: Number,
        required: true
    }
});

const Product = new mongoose.model("products", productSchema); //create product model
export default Product; //export product model