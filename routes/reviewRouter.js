import express from "express";
import { createReview, getReviews } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/", createReview);
reviewRouter.get("/:productId", getReviews);

export default reviewRouter;