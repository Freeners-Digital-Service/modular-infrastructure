const express = require("express");

function systemWebsiteConnections(pool) {
  const router = express.Router();

  /* =========================
     CONNECT SYSTEM  WEBSITE
  ========================= */

  router.post("/connect", async (req, res) => {
    try {
      const { client_id, system_id, client_product_id } = req.body;

      // 1. Validate input
      if (!client_id || !system_id || !client_product_id) {
        return res.status(400).json({
          error: "client_id, system_id, client_product_id required"
        });
      }

      // 2. Verify client owns the system
      const systemCheck = await pool.query(
        `SELECT * FROM client_systems WHERE client_id = $1 AND system_id = $2`,
        [client_id, system_id]
      );

      if (systemCheck.rows.length === 0) {
        return res.status(403).json({
          error: "Client does not own this system"
        });
      }

      // 3. Verify client owns the website (client product)
      const websiteCheck = await pool.query(
        `SELECT * FROM client_products WHERE client_id = $1 AND id = $2`,
        [client_id, client_product_id]
      );

      if (websiteCheck.rows.length === 0) {
        return res.status(403).json({
          error: "Client does not own this website"
        });
      }

      // 4. Check if connection already exists
      const existing = await pool.query(
        `SELECT * FROM system_website_connections 
         WHERE client_id = $1 AND system_id = $2 AND client_product_id = $3`,
        [client_id, system_id, client_product_id]
      );

      if (existing.rows.length > 0) {
        const connection = existing.rows[0];

        // 5. If already connected
        if (connection.status === "connected") {
          return res.status(400).json({
            error: "System already connected to this website"
          });
        }

        // 6. Reconnect
        await pool.query(
          `UPDATE system_website_connections 
           SET status = 'connected', connected_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [connection.id]
        );

        return res.json({
          message: "System reconnected to website"
        });
      }

      // 7. Create new connection
      await pool.query(
        `INSERT INTO system_website_connections 
         (client_id, system_id, client_product_id, status)
         VALUES ($1, $2, $3, 'connected')`,
        [client_id, system_id, client_product_id]
      );

      res.json({
        message: "System connected to website successfully"
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Connection failed"
      });
    }
  });

  /* =========================
     DISCONNECT SYSTEM  WEBSITE
  ========================= */

  router.post("/disconnect", async (req, res) => {
    try {
      const { client_id, system_id, client_product_id } = req.body;

      if (!client_id || !system_id || !client_product_id) {
        return res.status(400).json({
          error: "client_id, system_id, client_product_id required"
        });
      }

      const existing = await pool.query(
        `SELECT * FROM system_website_connections
         WHERE client_id = $1 AND system_id = $2 AND client_product_id = $3`,
        [client_id, system_id, client_product_id]
      );

      if (existing.rows.length === 0) {
        return res.status(404).json({
          error: "Connection not found"
        });
      }

      const connection = existing.rows[0];

      if (connection.status === "disconnected") {
        return res.status(400).json({
          error: "Already disconnected"
        });
      }

      await pool.query(
        `UPDATE system_website_connections
         SET status = 'disconnected'
         WHERE id = $1`,
        [connection.id]
      );

      res.json({
        message: "System disconnected from website successfully"
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Disconnect failed"
      });
    }
  });

  return router;
}

module.exports = systemWebsiteConnections;