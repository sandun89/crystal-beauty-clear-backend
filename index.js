import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import verifyJWT from './middleware/auth.js';
import orderRouter from './routes/orderRouter.js';

const app = express();

// database connection
// mongodb+srv://admin:123@cluster0.eplv8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect('mongodb+srv://admin:123@cluster0.eplv8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(
    ()=>{
        console.log('Database Successflly Connected');
    }
).catch(
    ()=>{
        console.log('Error');
    }
)

app.use(bodyParser.json());
app.use(verifyJWT);

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);


app.listen(5000, ()=>{
    console.log("Server is running");
});