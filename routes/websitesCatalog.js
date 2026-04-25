const express = require("express");

function websitesCatalog(pool) {
  const router = express.Router();

  /* =========================
     CREATE WEBSITE TYPE
  ========================= */
  router.post("/create", async (req, res) => {
    try {
      const { name, description, base_price, monthly_price, yearly_price } = req.body;

      // 1. Validate input
      if (!name || !base_price) {
        return res.status(400).json({
          error: "name and base_price are required"
        });
      }

      // 2. Prevent duplicate name
      const existing = await pool.query(
        `SELECT * FROM websites_catalog WHERE name = $1`,
        [name]
      );

      if (existing.rows.length > 0) {
        return res.status(400).json({
          error: "Website type already exists"
        });
      }

      // 3. Insert
      const result = await pool.query(
        `INSERT INTO websites_catalog 
         (name, description, base_price, monthly_price, yearly_price)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [name, description || null, base_price, monthly_price || null, yearly_price || null]
      );

      res.json({
        message: "Website type created successfully",
        data: result.rows[0]
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Failed to create website type"
      });
    }
  });

  /* =========================
     GET ALL WEBSITE TYPES
  ========================= */
  router.get("/", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT * FROM websites_catalog
        ORDER BY created_at DESC
      `);

      res.json({
        data: result.rows
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Failed to fetch websites catalog"
      });
    }
  });

  /* =========================
     GET SINGLE WEBSITE TYPE
  ========================= */
  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `SELECT * FROM websites_catalog WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Website type not found"
        });
      }

      res.json({
        data: result.rows[0]
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Failed to fetch website type"
      });
    }
  });

  return router;
}

module.exports = websitesCatalog;