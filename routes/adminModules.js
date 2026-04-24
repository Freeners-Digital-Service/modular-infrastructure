const express = require("express");

function adminModules(pool, renderPage) {
  const router = express.Router();

  /* =========================
     Admin Modules Routes
  ========================= */

  router.get("/modules", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT m.id, m.name, s.name AS system
        FROM modules m
        LEFT JOIN system_modules sm ON m.id = sm.module_id
        LEFT JOIN systems s ON sm.system_id = s.id
      `);

      let rows = result.rows.map(m => `
        <tr>
          <td>${m.id}</td>
          <td>${m.name}</td>
          <td>${m.system || "N/A"}</td>
        </tr>
      `).join("");

      const content = `
        <table>
          <tr>
            <th>ID</th>
            <th>Module Name</th>
            <th>System</th>
          </tr>
          ${rows}
        </table>
      `;

      res.send(renderPage("Modules", content));

    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminModules;