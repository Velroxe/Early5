import express from "express";
import { sql } from "../db/index.js";
import { verifyAuthAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ======================================================
   🟢 CREATE ORDER (COD / WHATSAPP / ONLINE)
   Body:
   {
     buyer_name,
     buyer_address?,        // optional for whatsapp
     buyer_phone,
     buyer_email?,          // optional
     order_type,            // "cod" | "whatsapp" | "online"
     items?: [              // optional for whatsapp
       { product_id, quantity }
     ]
   }
====================================================== */
router.post("/", async (req, res) => {
  const {
    buyer_name,
    buyer_address,
    buyer_phone,
    buyer_email,
    order_type,
    items,
  } = req.body;

  if (
    !buyer_name ||
    !buyer_phone ||
    !order_type ||
    !["cod", "whatsapp", "online"].includes(order_type)
  ) {
    return res.status(400).json({ message: "Invalid order payload" });
  }

  const safeBuyerEmail = buyer_email ?? null;
  const safeBuyerAddress = buyer_address ?? null;

  try {
    let totalAmount = 0;
    const orderItems = [];

    /* -------------------------
       Calculate total (COD / ONLINE)
    --------------------------*/
    if (order_type !== "whatsapp") {
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Items are required" });
      }

      for (const { product_id, quantity } of items) {
        if (!product_id || !quantity || quantity <= 0) {
          return res.status(400).json({ message: "Invalid item data" });
        }

        const [product] = await sql`
          SELECT price_inr, discounted_price_inr
          FROM products
          WHERE id = ${product_id};
        `;

        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }

        const unitPrice =
          product.discounted_price_inr ?? product.price_inr;

        totalAmount += unitPrice * quantity;

        if(totalAmount < 2000) totalAmount += 150;

        orderItems.push({
          product_id,
          quantity,
          price_inr: product.price_inr,
          discounted_price_inr: product.discounted_price_inr ?? null,
        });
      }
    }

    /* -------------------------
       Create Order
    --------------------------*/
    const [order] = await sql`
      INSERT INTO orders (
        buyer_name,
        buyer_address,
        buyer_phone,
        buyer_email,
        order_type,
        payment_method,
        payment_status,
        order_status,
        total_amount
      )
      VALUES (
        ${buyer_name},
        ${safeBuyerAddress},
        ${buyer_phone},
        ${safeBuyerEmail},
        ${order_type},
        ${order_type === "online" ? "online" : order_type === "cod" ? "cod" : "none"},
        'unpaid',
        'pending',
        ${totalAmount}
      )
      RETURNING *;
    `;

    /* -------------------------
       Insert Order Items
    --------------------------*/
    for (const item of orderItems) {
      await sql`
        INSERT INTO order_items (
          order_id,
          product_id,
          quantity,
          price_inr,
          discounted_price_inr
        )
        VALUES (
          ${order.id},
          ${item.product_id},
          ${item.quantity},
          ${item.price_inr},
          ${item.discounted_price_inr}
        );
      `;
    }

    res.status(201).json({
      message: "Order created successfully",
      order_id: order.id,
      order_type: order.order_type,
      payment_method: order.payment_method,
      total_amount: order.total_amount,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   🟡 GET ALL ORDERS (Admin)
====================================================== */
router.get("/", verifyAuthAdmin, async (req, res) => {
  try {
    const orders = await sql`
      SELECT *
      FROM orders
      ORDER BY created_at DESC;
    `;

    if (orders.length === 0) return res.json([]);

    const orderIds = orders.map(o => o.id);

    const items = await sql`
      SELECT 
        oi.order_id,
        oi.product_id,
        oi.quantity,
        oi.price_inr,
        oi.discounted_price_inr,
        p.title AS product_title
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ANY(${orderIds});
    `;

    const grouped = {};
    for (const item of items) {
      if (!grouped[item.order_id]) grouped[item.order_id] = [];
      grouped[item.order_id].push(item);
    }

    res.json(
      orders.map(order => ({
        ...order,
        items: grouped[order.id] || [],
      }))
    );
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   🔵 GET SINGLE ORDER (Admin)
====================================================== */
router.get("/:id", verifyAuthAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const [order] = await sql`
      SELECT * FROM orders WHERE id = ${id};
    `;

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    const items = await sql`
      SELECT 
        oi.product_id,
        oi.quantity,
        oi.price_inr,
        oi.discounted_price_inr,
        p.title AS product_title
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${id};
    `;

    res.json({ ...order, items });
  } catch (err) {
    console.error("Get order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   🔓 PUBLIC ORDER STATUS (For frontend polling)
====================================================== */
router.get("/public/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [order] = await sql`
      SELECT
        id,
        payment_status,
        order_status,
        payment_method,
        total_amount,
        paid_at,
        created_at
      FROM orders
      WHERE id = ${id};
    `;

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Public order status error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   🟠 UPDATE ORDER STATUS (Admin)
====================================================== */
router.put("/:id/status", verifyAuthAdmin, async (req, res) => {
  const { id } = req.params;
  const { payment_status, order_status } = req.body;

  if (!payment_status && !order_status) {
    return res.status(400).json({ message: "No fields to update" });
  }

  try {
    const [updated] = await sql`
      UPDATE orders
      SET
        payment_status = COALESCE(${payment_status ?? null}, payment_status),
        order_status = COALESCE(${order_status ?? null}, order_status),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;

    if (!updated)
      return res.status(404).json({ message: "Order not found" });

    res.json({
      message: "Order status updated successfully",
      order: updated,
    });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   🔴 DELETE ORDER (Admin)
====================================================== */
router.delete("/:id", verifyAuthAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await sql`
      DELETE FROM orders
      WHERE id = ${id}
      RETURNING id;
    `;

    if (deleted.length === 0)
      return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
