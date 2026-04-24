const express = require("express");

function adminAgents(pool, renderPage) {
  const router = express.Router();

  /* =========================
     Admin Agents Routes
  ========================= */

  router.get("/agents", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT a.id, a.name, m.name AS module
        FROM agents a
        LEFT JOIN module_agents ma ON a.id = ma.agent_id
        LEFT JOIN modules m ON ma.module_id = m.id
      `);

      let rows = result.rows.map(a => `
        <tr>
          <td>${a.id}</td>
          <td>${a.name}</td>
          <td>${a.module || "N/A"}</td>
        </tr>
      `).join("");

      const content = `
        <table>
          <tr>
            <th>ID</th>
            <th>Agent Name</th>
            <th>Module</th>
          </tr>
          ${rows}
        </table>
      `;

      res.send(renderPage("Agents", content));

    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminAgents;