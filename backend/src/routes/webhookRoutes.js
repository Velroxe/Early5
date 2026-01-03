import express from "express";
import crypto from "crypto";
import { sql } from "../db/index.js";

const router = express.Router();

/* ======================================================
   🔔 RAZORPAY WEBHOOK
====================================================== */
router.post("/", async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(req.body)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.error("Invalid Razorpay webhook signature");
    return res.status(400).json({ message: "Invalid signature" });
  }

  const event = JSON.parse(req.body.toString());

  try {
    /* -------------------------
       PAYMENT CAPTURED
    --------------------------*/
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      const razorpayOrderId = payment.order_id;

      const [order] = await sql`
        SELECT id
        FROM orders
        WHERE razorpay_order_id = ${razorpayOrderId};
      `;

      if (!order) {
        return res.status(200).json({ message: "Order not found" });
      }

      // Update order
      await sql`
        UPDATE orders
        SET
          payment_status = 'paid',
          order_status = 'confirmed',
          paid_at = NOW()
        WHERE id = ${order.id};
      `;

      // Save payment record
      await sql`
        INSERT INTO payments (
          order_id,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          amount,
          status
        )
        VALUES (
          ${order.id},
          ${payment.order_id},
          ${payment.id},
          ${signature},
          ${payment.amount / 100},
          'captured'
        );
      `;
    }

    /* -------------------------
       PAYMENT FAILED
    --------------------------*/
    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;

      await sql`
        UPDATE orders
        SET payment_status = 'failed'
        WHERE razorpay_order_id = ${payment.order_id};
      `;
    }

    res.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).json({ message: "Webhook error" });
  }
});

export default router;
