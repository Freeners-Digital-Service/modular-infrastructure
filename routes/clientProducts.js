const express = require("express");

function clientProducts(pool) {
  const router = express.Router();

  /* =========================
     CREATE CLIENT WEBSITE (PURCHASE)
  ========================= */

  router.post("/create", async (req, res) => {
    try {
      const { client_id, website_id, selected_plan } = req.body;

      // 1. Validate input
      if (!client_id || !website_id || !selected_plan) {
  return res.status(400).json({
    error: "client_id, website_id and selected_plan are required"
        });
      }

      // 2. Check website exists in catalog
      const websiteCheck = await pool.query(
        `SELECT * FROM websites_catalog WHERE id = $1`,
        [website_id]
      );

      if (websiteCheck.rows.length === 0) {
        return res.status(404).json({
          error: "Website type not found in catalog"
        });
      }

      const website = websiteCheck.rows[0];

      // 3. Optional: prevent duplicate same website for same client
      const existing = await pool.query(
        `SELECT * FROM client_products 
         WHERE client_id = $1 AND website_id = $2`,
        [client_id, website_id]
      );

      if (existing.rows.length > 0) {
        return res.status(400).json({
          error: "Client already owns this website type"
        });
      }

      // 4. Insert new client product
      const result = await pool.query(
        `INSERT INTO client_products
         (client_id, website_id, selected_plan, status)
         VALUES ($1, $2, $3, 'configuring')
         RETURNING *`,
        [
          client_id,
          website_id,
          selected_plan
        ]
      );

      res.json({
        message: "Website purchased successfully",
        data: {
          client_product: result.rows[0],
          website: website
        }
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Failed to create client website"
      });
    }
  });

  /* =========================
   GET ALL CLIENT WEBSITES
========================= */

router.get("/", async (req, res) => {
  try {

    const { client_id } = req.query;

    if (!client_id) {
      return res.status(400).json({
        error: "client_id is required"
      });
    }

    const result = await pool.query(
      `
        SELECT
          cp.id,
          cp.client_id,
          cp.website_id,
          cp.selected_plan,
          cp.status,
          cp.created_at,

          w.name,
          w.description,
          w.setup_fee,

          w.basic_monthly_fee,
          w.standard_monthly_fee,
          w.legend_monthly_fee,

          w.basic_features,
          w.standard_features,
          w.legend_features

        FROM client_products cp

        LEFT JOIN websites_catalog w
          ON cp.website_id = w.id

        WHERE cp.client_id = $1

        ORDER BY cp.created_at DESC
      `,
      [client_id]
    );

    res.json({
      data: result.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch client products"
    });
   }
   });


   /* =========================
   GET CLIENT SYSTEMS
========================= */

router.get("/systems", async (req, res) => {
  try {

    const { client_id } = req.query;

    if (!client_id) {
      return res.status(400).json({
        error: "client_id is required"
      });
    }

    const result = await pool.query(
      `
      SELECT
        cs.id,
        cs.client_id,
        cs.system_id,
        cs.status,
        cs.created_at,

        s.name,
        s.description,
        s.setup_fee,
        s.monthly_fee

      FROM client_systems cs

      LEFT JOIN systems_catalog s
        ON cs.system_id = s.id

      WHERE cs.client_id = $1

      ORDER BY cs.created_at DESC
      `,
      [client_id]
    );

    res.json({
      data: result.rows
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch client systems"
    });

  }
});



  /* =========================
     GET SINGLE CLIENT WEBSITE
  ========================= */

  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(`
        SELECT 
          cp.*,
          w.name,
          w.description,
          w.setup_fee,

          w.basic_monthly_fee,
          w.standard_monthly_fee,
          w.legend_monthly_fee,

          w.basic_features,
          w.standard_features,
          w.legend_features

        FROM client_products cp
        LEFT JOIN websites_catalog w ON cp.website_id = w.id
        WHERE cp.id = $1
      `, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Client website not found"
        });
      }

      res.json({
        data: result.rows[0]
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Failed to fetch client website"
      });
    }
  });

  return router;
}

module.exports = clientProducts;