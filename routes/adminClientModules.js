const express = require("express");

function adminClientModules(pool, renderPage) {
  const router = express.Router();

  /* =========================
     Admin Client Modules
  ========================= */

  router.get("/client-modules", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          cm.id,
          cm.client_id,
          cm.system_id,
          cm.module_id,
          cm.status,
          cm.activated_at,

          c.name AS client,
          s.name AS system,
          m.name AS module

        FROM client_modules cm

        LEFT JOIN clients c ON cm.client_id = c.id
        LEFT JOIN systems s ON cm.system_id = s.id
        LEFT JOIN modules m ON cm.module_id = m.id

        ORDER BY cm.activated_at DESC
      `);

      let rows = result.rows.map(r => `
        <tr>
          <td>${r.id}</td>
          <td>${r.client || r.client_id}</td>
          <td>${r.system || r.system_id}</td>
          <td>${r.module || r.module_id}</td>
          <td>${r.status}</td>
          <td>${r.activated_at}</td>
        </tr>
      `).join("");

      const content = `
        <table>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>System</th>
            <th>Module</th>
            <th>Status</th>
            <th>Activated At</th>
          </tr>
          ${rows}
        </table>
      `;

      res.send(renderPage("Client Modules", content));

    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminClientModules;