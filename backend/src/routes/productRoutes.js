import express from "express";
import { sql } from "../db/index.js";
import { verifyAuthAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================================================
   🟢 CREATE PRODUCT
   frontend sends:
   { title, description, price_inr, discounted_price_inr, type, images: [url] }
================================================ */

router.post("/", verifyAuthAdmin, async (req, res) => {
  const { title, description, price_inr, discounted_price_inr, type, images } = req.body;

  if (!title || !price_inr) {
    return res.status(400).json({ message: "Title and price are required." });
  }

  try {
    // Insert product
    const productResult = await sql`
      INSERT INTO products (title, description, price_inr, discounted_price_inr, type)
      VALUES (${title}, ${description}, ${price_inr}, ${discounted_price_inr}, ${type})
      RETURNING *;
    `;

    const product = productResult[0];

    // Insert images (if provided)
    if (Array.isArray(images)) {
      for (const [index, url] of images.entries()) {
        await sql`
          INSERT INTO product_images (product_id, image_url, order_index)
          VALUES (${product.id}, ${url}, ${index});
        `;
      }
    }

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================================
   🟡 GET ALL PRODUCTS
================================================ */

router.get("/", async (req, res) => {
  try {
    // Fetch products
    const products = await sql`
      SELECT * FROM products
      ORDER BY created_at DESC;
    `;

    if (products.length === 0) return res.json([]);

    // Extract IDs
    const productIds = products.map(p => p.id);

    // Fetch images for all products
    const images = await sql`
      SELECT product_id, image_url
      FROM product_images
      WHERE product_id = ANY(${productIds})
      ORDER BY order_index ASC, created_at ASC;
    `;

    // Attach images to products
    const imagesGrouped = {};
    images.forEach(img => {
      if (!imagesGrouped[img.product_id]) {
        imagesGrouped[img.product_id] = [];
      }
      imagesGrouped[img.product_id].push(img.image_url);
    });

    const result = products.map(p => ({
      ...p,
      images: imagesGrouped[p.id] || []
    }));

    res.json(result);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================================
   🔵 GET SINGLE PRODUCT (with images)
================================================ */

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const productResult = await sql`
      SELECT * FROM products WHERE id = ${id};
    `;

    if (productResult.length === 0)
      return res.status(404).json({ message: "Product not found" });

    const images = await sql`
      SELECT * FROM product_images 
      WHERE product_id = ${id}
      ORDER BY order_index ASC, created_at ASC;
    `;

    res.json({
      ...productResult[0],
      images,
    });
  } catch (err) {
    console.error("Get product error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================================
   🟠 UPDATE PRODUCT
   frontend sends same structure as create
================================================ */

router.put("/:id", verifyAuthAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, price_inr, discounted_price_inr, type, images } = req.body;

  try {
    const existing = await sql`SELECT * FROM products WHERE id = ${id}`;
    if (existing.length === 0)
      return res.status(404).json({ message: "Product not found" });

    // Update product fields
    const updated = await sql`
      UPDATE products
      SET
        title = ${title ?? existing[0].title},
        description = ${description ?? existing[0].description},
        price_inr = ${price_inr ?? existing[0].price_inr},
        discounted_price_inr = ${discounted_price_inr ?? existing[0].discounted_price_inr},
        type = ${type ?? existing[0].type},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;

    if (Array.isArray(images)) {
      await sql`DELETE FROM product_images WHERE product_id = ${id}`;

      for (const [index, url] of images.entries()) {
        await sql`
          INSERT INTO product_images (product_id, image_url, order_index)
          VALUES (${id}, ${url}, ${index});
        `;
      }
    }

    res.json({
      message: "Product updated successfully",
      product: updated[0],
    });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================================
   🔴 DELETE PRODUCT
   (Cascade deletes images)
================================================ */

router.delete("/:id", verifyAuthAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await sql`
      DELETE FROM products WHERE id = ${id}
      RETURNING id;
    `;

    if (deleted.length === 0)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
