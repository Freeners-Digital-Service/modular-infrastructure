const express = require("express");

function adminSystemHealth(pool, renderPage) {
  const router = express.Router();

  /* =========================
     Admin System Health
  ========================= */

  router.get("/system-health", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, system_id, cpu_usage, memory_usage, status, recorded_at
        FROM system_health
        ORDER BY recorded_at DESC
      `);

      let rows = result.rows.map(r => `
        <tr>
          <td>${r.id}</td>
          <td>${r.system_id || "N/A"}</td>
          <td>${r.cpu_usage || "N/A"}</td>
          <td>${r.memory_usage || "N/A"}</td>
          <td>${r.status || "N/A"}</td>
          <td>${r.recorded_at}</td>
        </tr>
      `).join("");

      const content = `
        <table>
          <tr>
            <th>ID</th>
            <th>System ID</th>
            <th>CPU Usage</th>
            <th>Memory Usage</th>
            <th>Status</th>
            <th>Recorded At</th>
          </tr>
          ${rows}
        </table>
      `;

      res.send(renderPage("System Health", content));

    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminSystemHealth;