import Order from "../models/order.js";
import { generateId } from "../utilities/helperUtil.js";

export function createOrder(req, res){

    if (req.user == null){
        req.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    const body = req.body;
    const orderData = {
        orderId: generateId("ORD") ,
        email: req.user.email,
        name: body.name,
        address: body.address,
        phoneNumber: body.phoneNumber,
        billItems: [],
        total: 0
    }

    const order = new Order(orderData);
    order.save().then(
        ()=>{
            res.json({
                message: "Order saved successfully"
            });
        }
    ).catch(
        ()=>{
            res.status(500).json({
                message: "Order not saved"
            });
        }
    );
}

export function getOrders(req, res){
    if (req.user == null) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    if (req.user.role == "admin"){
        Order.find().then(
            (orders)=>{
                res.json(orders);
            }
        ).catch(
            (err)=>{
                res.status(500).json({
                    message: "Orders not found"
                });
            }
        )
    } else {
        Order.find({
            email: req.user.email
        }).then(
            (orders)=>{
                res.json(orders);
            }
        ).catch(
            (err)=>{
                res.status(500).json({
                    message: "Orders not found"
                });
            }
        )
    }
}