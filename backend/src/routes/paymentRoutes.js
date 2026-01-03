import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { sql } from "../db/index.js";
import { verifyAuthAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ======================================================
   🟢 CREATE RAZORPAY ORDER (Online Payments)
   Body:
   {
     order_id  // internal order.id
   }
====================================================== */
router.post("/create-order", async (req, res) => {
  const { order_id } = req.body;

  if (!order_id) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  try {
    const [order] = await sql`
      SELECT id, total_amount
      FROM orders
      WHERE id = ${order_id}
        AND payment_method = 'online';
    `;

    if (!order) {
      return res.status(404).json({ message: "Order not found or not online" });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.total_amount * 100), // paise
      currency: "INR",
      receipt: `e5_${order.id}`,
    });

    await sql`
      UPDATE orders
      SET razorpay_order_id = ${razorpayOrder.id}
      WHERE id = ${order.id};
    `;

    res.json({
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Create Razorpay order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
