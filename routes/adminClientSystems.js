const express = require("express");

function adminClientSystems(pool, renderPage) {
  const router = express.Router();

  /* =========================
     Admin Client Systems
  ========================= */

  router.get("/client-systems", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT cs.id, c.name AS client, s.name AS system
        FROM client_systems cs
        LEFT JOIN clients c ON cs.client_id = c.id
        LEFT JOIN systems s ON cs.system_id = s.id
      `);

      let rows = result.rows.map(r => `
        <tr>
          <td>${r.id}</td>
          <td>${r.client || "N/A"}</td>
          <td>${r.system || "N/A"}</td>
        </tr>
      `).join("");

      const content = `
        <table>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>System</th>
          </tr>
          ${rows}
        </table>
      `;

      res.send(renderPage("Client Systems", content));

    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminClientSystems;