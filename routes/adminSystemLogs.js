const express = require("express");

function adminSystemLogs(pool, renderPage) {
  const router = express.Router();

  /* =========================
     Admin System Logs
  ========================= */

  router.get("/system-logs", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, system_id, level, message, created_at
        FROM system_logs
        ORDER BY created_at DESC
      `);

      let rows = result.rows.map(r => `
        <tr>
          <td>${r.id}</td>
          <td>${r.system_id || "N/A"}</td>
          <td>${r.level || "N/A"}</td>
          <td>${r.message || "N/A"}</td>
          <td>${r.created_at}</td>
        </tr>
      `).join("");

      const content = `
        <table>
          <tr>
            <th>ID</th>
            <th>System ID</th>
            <th>Level</th>
            <th>Message</th>
            <th>Created At</th>
          </tr>
          ${rows}
        </table>
      `;

      res.send(renderPage("System Logs", content));

    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminSystemLogs;