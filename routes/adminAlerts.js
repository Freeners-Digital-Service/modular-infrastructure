const express = require("express");

function adminAlerts(pool, renderPage) {
  const router = express.Router();

  /* =========================
     Admin Alerts
  ========================= */

  router.get("/alerts", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, system_id, type, message, status, created_at
        FROM alerts
        ORDER BY created_at DESC
      `);

      let rows = result.rows.map(r => `
        <tr>
          <td>${r.id}</td>
          <td>${r.system_id || "N/A"}</td>
          <td>${r.type || "N/A"}</td>
          <td>${r.message || "N/A"}</td>
          <td>${r.status || "N/A"}</td>
          <td>${r.created_at}</td>
        </tr>
      `).join("");

      const content = `
        <table>
          <tr>
            <th>ID</th>
            <th>System ID</th>
            <th>Type</th>
            <th>Message</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
          ${rows}
        </table>
      `;

      res.send(renderPage("Alerts", content));

    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminAlerts;