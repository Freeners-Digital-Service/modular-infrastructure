const express = require("express");

function systemsCatalog(pool) {
  const router = express.Router();

  /* =========================
     GET SINGLE SYSTEM ONLY
  ========================= */
  router.get("/systems/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `SELECT 
          id,
          name,
          full_name,
          type,
          category,
          label,
          description,
          setup_fee,
          monthly_fee
         FROM systems_catalog
         WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "System not found"
        });
      }

      res.json(result.rows[0]);

    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Failed to fetch system"
      });
    }
  });

  return router;
}

module.exports = systemsCatalog;