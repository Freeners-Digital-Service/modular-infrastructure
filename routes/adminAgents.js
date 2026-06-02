const express = require("express");

function adminAgents(pool, renderPage) {
  const router = express.Router();
/* =========================
     Admin Agents Routes
========================= */

router.get("/agents", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        a.id,
        a.agent_id,
        a.name,
        a.status,

        COUNT(DISTINCT ac.id) AS capability_count,
        COUNT(DISTINCT at.id) AS task_count

      FROM agents a

      LEFT JOIN agent_capabilities ac
        ON a.agent_id = ac.agent_id

      LEFT JOIN agent_tasks at
        ON a.agent_id = at.agent_id

      GROUP BY
        a.id,
        a.agent_id,
        a.name,
        a.status

      ORDER BY a.name
    `);

    let rows = result.rows.map(a => `
      <tr>
        <td>${a.id}</td>
        <td>${a.agent_id || "N/A"}</td>
        <td>${a.name || "N/A"}</td>
        <td>${a.capability_count || 0}</td>
        <td>${a.task_count || 0}</td>
        <td>${a.status || "N/A"}</td>
        <td>
          <a href="/admin/agent-capabilities">
            Capabilities
          </a>
          |
          <a href="/admin/agent-tasks">
            Tasks
          </a>
        </td>
      </tr>
    `).join("");

    const content = `
      <div style="overflow-x:auto; width:100%;">
        <table style="min-width:1400px;">
          <tr>
            <th>ID</th>
            <th>Agent ID</th>
            <th>Agent Name</th>
            <th>Capabilities</th>
            <th>Tasks</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>

          ${rows}

        </table>
      </div>
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