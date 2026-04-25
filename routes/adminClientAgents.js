const express = require("express");

function adminClientAgents(pool, renderPage) {
  const router = express.Router();

  /* =========================
     Admin Client Agents
  ========================= */

  router.get("/client-agents", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          ca.id,
          ca.client_id,
          ca.system_id,
          ca.module_id,
          ca.agent_id,
          ca.status,
          ca.activated_at,

          c.name AS client,
          s.name AS system,
          m.name AS module,
          a.name AS agent

        FROM client_agents ca

        LEFT JOIN clients c ON ca.client_id = c.id
        LEFT JOIN systems s ON ca.system_id = s.id
        LEFT JOIN modules m ON ca.module_id = m.id
        LEFT JOIN agents a ON ca.agent_id = a.id

        ORDER BY ca.activated_at DESC
      `);

      let rows = result.rows.map(r => `
        <tr>
          <td>${r.id}</td>
          <td>${r.client || r.client_id}</td>
          <td>${r.system || r.system_id}</td>
          <td>${r.module || r.module_id}</td>
          <td>${r.agent || r.agent_id}</td>
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
            <th>Agent</th>
            <th>Status</th>
            <th>Activated At</th>
          </tr>
          ${rows}
        </table>
      `;

      res.send(renderPage("Client Agents", content));

    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminClientAgents;