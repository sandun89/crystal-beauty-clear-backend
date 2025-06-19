import Order from "../models/order.js";
import Product from "../models/product.js";
import { generateUniqueId } from "../utils/helperUtil.js";

export async function createOrder(req, res) {
  if (req.user == null) {
    req.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const body = req.body;
  const orderData = {
    orderId: generateUniqueId("ORD", 10),
    email: req.user.email,
    name: body.name,
    address: body.address,
    phoneNumber: body.phoneNumber,
    billItems: [],
    total: 0,
  };
  for (let i = 0; i < body.billItems.length; i++) {
    const product = await Product.findOne({productId: body.billItems[i].productId});
    if (product == null) {
      res.status(404).json({
        message: "Product with Product ID " + body.billItems[i].productId + " Not Found"
      });
      return;
    }

    orderData.billItems[i] = {
      productId: product.productId,
      productName: product.name,
      image: product.images[0],
      quantity: body.billItems[i].quantity,
      price: product.price
    }
    orderData.total = orderData.total + product.price * body.billItems[i].quantity;
  }

  const order = new Order(orderData);
  order
    .save()
    .then(() => {
      res.json({
        message: "Order Saved successfully",
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Order not saved",
      });
    });
}

export function getOrders(req, res) {
  if (req.user == null) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  if (req.user.role == "admin") {
    Order.find()
      .then((orders) => {
        res.json(orders);
      })
      .catch((err) => {
        res.status(500).json({
          message: "Orders not found",
        });
      });
  } else {
    Order.find({
      email: req.user.email,
    })
      .then((orders) => {
        res.json(orders);
      })
      .catch((err) => {
        res.status(500).json({
          message: "Orders not found",
        });
      });
  }
}

export async function updateOrder(req, res){
  try {
    if (req.user == null) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }
    if (req.user.role != "admin") {
      res.status(403).json({
        message: "You are Unauthorized to Update an Order",
      });
      return;
    }
    const orderId = req.params.orderId;
    const order = await Order.findOneAndUpdate({ orderId: orderId }, req.body);
  } catch (error) {
    res.status(500).json({
      message: "Örder not Updated",
    });
  }
}
