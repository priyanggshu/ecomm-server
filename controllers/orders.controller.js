import Order from "../db/Order";
import mongoose from "mongoose";
import { orderSchema } from "../validation/types";

export const createOrderController = async (req, res) => {
  try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "User authentication required" });
      };

    const { orderItems, shippingAddress, paymentMethod, totalPrice } = orderSchema.parse(req.body);

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: "Order items none" });
    };

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const fetchOrderController = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const fetchOrdersController = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User authentication required" });
    }

    const orders = await Order.find({ user: req.user._id });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const payOrderController = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!req.body.id || !req.body.status || !req.body.updated_time || !req.body.email_address) {
        return res.status(400).json({ message: "Payment details missing" });
      }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      updated_time: req.body.updated_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const deliverOrderController = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};
