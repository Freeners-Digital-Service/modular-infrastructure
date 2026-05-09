const express = require("express");

function websitesCatalog(pool) {
  const router = express.Router();

  /* =========================
     GET SINGLE WEBSITE ONLY
  ========================= */
  router.get("/websites/:id", async (req, res) => {
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
         FROM websites_catalog
         WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Website not found"
        });
      }

      res.json(result.rows[0]);

    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Failed to fetch website"
      });
    }
  });

  return router;
}

module.exports = websitesCatalog;