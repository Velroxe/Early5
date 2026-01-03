import express from "express";
import { sql } from "../db/index.js";
import { verifyAuthAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ======================================================
   📊 DASHBOARD DATA (Admin Only)
   GET /api/dashboard
====================================================== */
router.get("/", verifyAuthAdmin, async (req, res) => {
  try {
    /* -------------------------
       ORDERS SUMMARY
    --------------------------*/
    const [orderSummary] = await sql`
      SELECT
        COUNT(*)::int AS total_orders,
        COUNT(*) FILTER (WHERE payment_status = 'paid')::int AS paid_orders,
        COUNT(*) FILTER (WHERE payment_status = 'unpaid')::int AS unpaid_orders,
        COUNT(*) FILTER (WHERE payment_status = 'failed')::int AS failed_orders,
        COALESCE(SUM(total_amount) FILTER (WHERE payment_status = 'paid'), 0)::numeric AS total_revenue
      FROM orders;
    `;

    /* -------------------------
       ORDERS BY TYPE
    --------------------------*/
    const ordersByType = await sql`
      SELECT
        order_type,
        COUNT(*)::int AS count
      FROM orders
      GROUP BY order_type;
    `;

    /* -------------------------
       ORDERS BY STATUS
    --------------------------*/
    const ordersByStatus = await sql`
      SELECT
        order_status,
        COUNT(*)::int AS count
      FROM orders
      GROUP BY order_status;
    `;

    /* -------------------------
       RECENT ORDERS
    --------------------------*/
    const recentOrders = await sql`
      SELECT
        id,
        buyer_name,
        order_type,
        payment_status,
        order_status,
        total_amount,
        created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5;
    `;

    /* -------------------------
       PRODUCTS SUMMARY
    --------------------------*/
    const [productSummary] = await sql`
      SELECT
        COUNT(*)::int AS total_products,
        COUNT(*) FILTER (WHERE discounted_price_inr IS NOT NULL)::int AS discounted_products
      FROM products;
    `;

    res.json({
      orders: {
        summary: orderSummary,
        byType: ordersByType,
        byStatus: ordersByStatus,
        recent: recentOrders,
      },
      products: productSummary,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
