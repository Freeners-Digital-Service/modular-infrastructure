const express = require("express");

function adminActivityLogs(pool, renderPage) {
  const router = express.Router();

  /* =========================
     Admin Activity Logs
  ========================= */

  router.get("/activity-logs", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, admin_id, action, target, created_at
        FROM activity_logs
        ORDER BY created_at DESC
      `);

      let rows = result.rows.map(r => `
        <tr>
          <td>${r.id}</td>
          <td>${r.admin_id || "N/A"}</td>
          <td>${r.action || "N/A"}</td>
          <td>${r.target || "N/A"}</td>
          <td>${r.created_at}</td>
        </tr>
      `).join("");

      const content = `
        <table>
          <tr>
            <th>ID</th>
            <th>Admin ID</th>
            <th>Action</th>
            <th>Target</th>
            <th>Created At</th>
          </tr>
          ${rows}
        </table>
      `;

      res.send(renderPage("Activity Logs", content));

    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminActivityLogs;
