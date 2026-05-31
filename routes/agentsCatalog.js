
const express = require("express");

function agentsCatalog(pool) {
  const router = express.Router();

  /* =========================
     GET SINGLE AGENT ONLY
  ========================= */
  router.get("/agents/:id", async (req, res) => {
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
           monthly_fee,

           capability_id,
           base_capability,

           supported_targets,

           status

         FROM agents_catalog
         WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Agent not found"
        });
      }

      res.json(result.rows[0]);

    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Failed to fetch agent"
      });
    }
  });

  return router;
}

module.exports = agentsCatalog;