const express = require("express");

function adminAgentTasks(pool, renderPage) {
  const router = express.Router();

  /* =========================
     Admin Agent Tasks
  ========================= */

  router.get("/agent-tasks", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, session_id, task, status, result, created_at
        FROM agent_tasks
        ORDER BY created_at DESC
      `);

      let rows = result.rows.map(r => `
        <tr>
          <td>${r.id}</td>
          <td>${r.session_id}</td>
          <td>${r.task || "N/A"}</td>
          <td>${r.status || "N/A"}</td>
          <td>${r.result || "N/A"}</td>
          <td>${r.created_at || "N/A"}</td>
        </tr>
      `).join("");

      const content = `
        <table>
          <tr>
            <th>ID</th>
            <th>Session ID</th>
            <th>Task</th>
            <th>Status</th>
            <th>Result</th>
            <th>Created At</th>
          </tr>
          ${rows}
        </table>
      `;

      res.send(renderPage("Agent Tasks", content));

    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminAgentTasks;