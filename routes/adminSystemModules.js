const express = require("express");

function adminSystemModules(pool, renderPage) {
  const router = express.Router();

  /* =========================
     Admin System Modules
  ========================= */

  router.get("/system-modules", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT sm.id, s.name AS system, m.name AS module
        FROM system_modules sm
        LEFT JOIN systems s ON sm.system_id = s.id
        LEFT JOIN modules m ON sm.module_id = m.id
      `);

      let rows = result.rows.map(r => `
        <tr>
          <td>${r.id}</td>
          <td>${r.system || "N/A"}</td>
          <td>${r.module || "N/A"}</td>
        </tr>
      `).join("");

      const content = `
        <table>
          <tr>
            <th>ID</th>
            <th>System</th>
            <th>Module</th>
          </tr>
          ${rows}
        </table>
      `;

      res.send(renderPage("System Modules", content));

    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminSystemModules;