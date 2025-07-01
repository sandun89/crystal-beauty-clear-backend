import Product from "../models/product.js";

export function createProduct(req, res) {
  //check user logged
  if (req.user == null) {
    res.status(403).json({
      message: "You need to login first",
    });
    return;
  }

  //check logged user is admin
  if (req.user.role != "admin") {
    res.status(403).json({
      message: "You are not authorized to create a product",
    });
    return;
  }

  const product = new Product(req.body);
  product
    .save()
    .then(() => {
      res.json({
        message: "Product saved successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Product not saved",
      });
    });
}

export function getProducts(req, res) {
  Product.find()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Products not found",
      });
    });
}

export async function getProductById(req, res) {
  const productId = req.params.productId;
  const product = await Product.findOne({ productId: productId });
  if (product == null) {
    res.status(404).json({
      message: "Product Not Found",
    });
    return;
  }

  res.json({
    product: product,
  });
}

export function deleteProduct(req, res) {
  //check user logged
  if (req.user == null) {
    res.status(403).json({
      message: "You need to login first",
    });
    return;
  }

  //check user role
  if (req.user.role != "admin") {
    res.status(403).json({
      message: "You are not authorized to delete a product",
    });
    return;
  }

  Product.findOneAndDelete({
    productId: req.params.productId,
  })
    .then(() => {
      res.json({
        message: "Product deleted successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Product not deleted",
      });
    });
}

export function updateProduct(req, res) {
  if (req.user == null) {
    //check user
    res.status(403).json({
      message: "You need to login first",
    });
    return;
  }

  if (req.user.role != "admin") {
    //check user role
    res.status(403).json({
      message: "You are not authorized to create a product",
    });
    return;
  }

  Product.findOneAndUpdate(
    {
      productId: req.params.productId,
    },
    req.body
  )
    .then(() => {
      res.json({
        message: "Product updated successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Product not updated",
      });
    });
}

export async function searchProduct(req, res){
  const search = req.params.query;
  try {
    const products = await Product.find({
    $or: [
      {name: {$regex: search, $options: "i"}},
      {altName: { $elemMatch: {$regex: search, $options: "i"}}}
    ]
  });

  res.json({
    products: products
  });

  } catch (error) {
    res.status(500).json({
      message: "Error in Searching Product"
    });
    return;
  }
}

export async function getRandomProducts(req, res){
  try {
    const randomProducts = await Product.aggregate([
      {$sample: {size: 5}}
    ]);
    res.json({
      products: randomProducts
    })
  } catch (error) {
    res.status(500).json({
      message: "Something Went Wrong"
    })
  }
}