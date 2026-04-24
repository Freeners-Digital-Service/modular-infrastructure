const express = require("express");

function adminModuleAgents(pool, renderPage) {
  const router = express.Router();

  /* =========================
     Admin Module Agents
  ========================= */

  router.get("/module-agents", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT ma.id, m.name AS module, a.name AS agent
        FROM module_agents ma
        LEFT JOIN modules m ON ma.module_id = m.id
        LEFT JOIN agents a ON ma.agent_id = a.id
      `);

      let rows = result.rows.map(r => `
        <tr>
          <td>${r.id}</td>
          <td>${r.module || "N/A"}</td>
          <td>${r.agent || "N/A"}</td>
        </tr>
      `).join("");

      const content = `
        <table>
          <tr>
            <th>ID</th>
            <th>Module</th>
            <th>Agent</th>
          </tr>
          ${rows}
        </table>
      `;

      res.send(renderPage("Module Agents", content));

    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminModuleAgents;