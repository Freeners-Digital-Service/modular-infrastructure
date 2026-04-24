const express = require("express");

function adminMain(pool, renderPage) {
  const router = express.Router();

  /*==================
      ADMIN ROUTE
  ============= */

  router.get("/", async (req, res) => {
    try {
      const clients = await pool.query("SELECT COUNT(*) FROM clients");
      const systems = await pool.query("SELECT COUNT(*) FROM systems");
      const modules = await pool.query("SELECT COUNT(*) FROM modules");
      const agents = await pool.query("SELECT COUNT(*) FROM agents");

      const content = `
        <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:20px;">
          
          <div style="padding:20px; background:#f4f4f4;">
            <h2>Clients</h2>
            <p>${clients.rows[0].count}</p>
          </div>

          <div style="padding:20px; background:#f4f4f4;">
            <h2>Systems</h2>
            <p>${systems.rows[0].count}</p>
          </div>

          <div style="padding:20px; background:#f4f4f4;">
            <h2>Modules</h2>
            <p>${modules.rows[0].count}</p>
          </div>

          <div style="padding:20px; background:#f4f4f4;">
            <h2>Agents</h2>
            <p>${agents.rows[0].count}</p>
          </div>

        </div>
      `;

      res.send(renderPage("Dashboard", content));

    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminMain;