const express = require("express");

function adminSystems(pool, renderPage) {
  const router = express.Router();

  /*==================
      ADMIN Systems Route
  ======================*/

  router.get("/systems", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT s.id, s.name, c.name AS client
        FROM systems s
        LEFT JOIN clients c ON s.client_id = c.id
      `);

      let rows = result.rows.map(s => `
        <tr>
          <td>${s.id}</td>
          <td>${s.name}</td>
          <td>${s.client || "N/A"}</td>
        </tr>
      `).join("");

      const content = `
        <table>
          <tr>
            <th>ID</th>
            <th>System Name</th>
            <th>Client</th>
          </tr>
          ${rows}
        </table>
      `;

      res.send(renderPage("Systems", content));

    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminSystems;