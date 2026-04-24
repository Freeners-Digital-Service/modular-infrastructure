const express = require("express");

function adminAgentSessions(pool, renderPage) {
  const router = express.Router();

  /* =========================
     Admin Agent Sessions
  ========================= */

  router.get("/agent-sessions", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, agent_id, started_at, status
        FROM agent_sessions
        ORDER BY started_at DESC
      `);

      let rows = result.rows.map(r => `
        <tr>
          <td>${r.id}</td>
          <td>${r.agent_id}</td>
          <td>${r.started_at || "N/A"}</td>
          <td>${r.status || "N/A"}</td>
        </tr>
      `).join("");

      const content = `
        <table>
          <tr>
            <th>ID</th>
            <th>Agent ID</th>
            <th>Started At</th>
            <th>Status</th>
          </tr>
          ${rows}
        </table>
      `;

      res.send(renderPage("Agent Sessions", content));

    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminAgentSessions;