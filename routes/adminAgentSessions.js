const express = require("express");

function adminAgentSessions(pool, renderPage) {
  const router = express.Router();

  /* =========================
     Admin Agent Sessions
  ========================= */

  router.get("/agent-sessions", async (req, res) => {
    try {
      const result = await pool.query(`
  SELECT id, username, agent, status, created_at
  FROM agent_sessions
  ORDER BY created_at DESC
`);

let rows = result.rows.map(r => `
  <tr>
    <td>${r.id}</td>
    <td>${r.username || "N/A"}</td>
    <td>${r.agent || "N/A"}</td>
    <td>${r.status || "N/A"}</td>
    <td>${r.created_at || "N/A"}</td>
  </tr>
`).join("");

const content = `
  <table>
    <tr>
      <th>ID</th>
      <th>Username</th>
      <th>Agent</th>
      <th>Status</th>
      <th>Created At</th>
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