const express = require("express");

function adminAnalyticsEvents(pool, renderPage) {
  const router = express.Router();

  /* =========================
     Admin Analytics Events
  ========================= */

  router.get("/analytics-events", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, client_id, system_id, event_type, metadata, created_at
        FROM analytics_events
        ORDER BY created_at DESC
      `);

      let rows = result.rows.map(r => `
        <tr>
          <td>${r.id}</td>
          <td>${r.client_id || "N/A"}</td>
          <td>${r.system_id || "N/A"}</td>
          <td>${r.event_type || "N/A"}</td>
          <td>${r.metadata || "N/A"}</td>
          <td>${r.created_at}</td>
        </tr>
      `).join("");

      const content = `
        <table>
          <tr>
            <th>ID</th>
            <th>Client ID</th>
            <th>System ID</th>
            <th>Event Type</th>
            <th>Metadata</th>
            <th>Created At</th>
          </tr>
          ${rows}
        </table>
      `;

      res.send(renderPage("Analytics Events", content));

    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminAnalyticsEvents;