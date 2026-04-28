const express = require("express");

function adminSystemConnections(pool, renderPage) {
  const router = express.Router();

  /* =========================
     VIEW ALL CONNECTIONS
  ========================= */

  router.get("/connections", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          sw.id,
          sw.client_id,
          sw.system_id,
          sw.client_product_id,
          sw.status,
          sw.connected_at,

          c.name AS client_name,
          s.name AS system_name,
          w.name AS website_name,
          cp.domain_name

        FROM system_website_connections sw

        LEFT JOIN clients c ON sw.client_id = c.id
        LEFT JOIN systems s ON sw.system_id = s.id
        LEFT JOIN client_products cp ON sw.client_product_id = cp.id
        LEFT JOIN websites_catalog w ON cp.website_id = w.id

        ORDER BY sw.connected_at DESC
      `);

      let rows = result.rows.map(r => `
        <tr>
          <td>${r.id}</td>
          <td>${r.client_name || r.client_id}</td>
          <td>${r.system_name || r.system_id}</td>
          <td>${r.website_name || r.client_product_id}</td>
          <td>${r.domain_name || "-"}</td>
          <td>${r.status}</td>
          <td>${r.connected_at}</td>
        </tr>
      `).join("");

      const content = `
        <table border="1" cellpadding="10">
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>System</th>
            <th>Website</th>
            <th>Domain</th>
            <th>Status</th>
            <th>Connected At</th>
          </tr>
          ${rows}
        </table>
      `;

      res.send(renderPage("System ↔ Client Product Connections", content));

    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminSystemConnections;