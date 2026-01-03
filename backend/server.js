import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

import authAdminRoutes from "./src/routes/authAdminRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import clearOldDataRoutes from "./src/routes/clearOldDataRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import webhookRoutes from "./src/routes/webhookRoutes.js";

const app = express();
app.disable("etag");

/* ======================================================
   🔔 RAZORPAY WEBHOOK (MUST BE FIRST)
====================================================== */
app.use(
  "/api/webhooks/razorpay",
  express.raw({ type: "application/json" }),
  webhookRoutes
);

/* ======================================================
   🌐 NORMAL MIDDLEWARES
====================================================== */
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  process.env.ADMIN_HOST,
  process.env.ECOM_HOST,
];

// app.use(cors());

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

/* ======================================================
   🧩 ROUTES
====================================================== */
app.use("/api/auth/admin", authAdminRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/cleanup", clearOldDataRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
