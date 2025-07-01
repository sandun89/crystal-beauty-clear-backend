import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getRandomProducts,
  searchProduct,
  updateProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/", createProduct);
productRouter.get("/random", getRandomProducts);
productRouter.get("/", getProducts);
productRouter.get("/:productId", getProductById);
productRouter.get("/search/:query", searchProduct);
productRouter.delete("/:productId", deleteProduct);
productRouter.put("/:productId", updateProduct);

export default productRouter;
