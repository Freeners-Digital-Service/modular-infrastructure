const express = require("express");

function adminAgentTaskLogs(pool, renderPage) {

  const router = express.Router();

  /* =========================
   Agent Task Logs
========================= */

router.get("/agent-task-logs", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        id,
        client_name,
        client_id,
        agent_name,
        agent_id,
        task_name,
        task_id,
        event_type,
        status,
        created_at
      FROM agent_task_logs
      ORDER BY created_at DESC
    `);

    let rows = result.rows.map(r => `
      <tr>
        <td>${r.id}</td>
        <td>${r.client_name || "N/A"}</td>
        <td>${r.client_id || "N/A"}</td>
        <td>${r.agent_name || "N/A"}</td>
        <td>${r.agent_id || "N/A"}</td>
        <td>${r.task_name || "N/A"}</td>
        <td>${r.task_id || "N/A"}</td>
        <td>${r.event_type || "N/A"}</td>
        <td>${r.status || "N/A"}</td>
        <td>${r.created_at || "N/A"}</td>
      </tr>
    `).join("");

    const content = `
    
          <tr>
            <th>ID</th>
            <th>Client Name</th>
            <th>Client ID</th>
            <th>Agent Name</th>
            <th>Agent ID</th>
            <th>Task Name</th>
            <th>Task ID</th>
            <th>Event Type</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>

          ${rows}

        </table>
      </div>
    `;

    res.send(
      renderPage(
        "Agent Task Logs",
        content
      )
    );

  } catch (err) {

    console.error(err);
    res.send(err.message);

  }
});

/* =========================
   View Log
========================= */

router.get("/agent-task-logs/view/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM agent_task_logs
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.send("Log not found");
    }

    const log = result.rows[0];

    const content = `

      <p><strong>Client Name:</strong>
      ${log.client_name || "N/A"}</p>

      <p><strong>Client ID:</strong>
      ${log.client_id || "N/A"}</p>

      <p><strong>Agent Name:</strong>
      ${log.agent_name || "N/A"}</p>

      <p><strong>Agent ID:</strong>
      ${log.agent_id || "N/A"}</p>

      <p><strong>Task Name:</strong>
      ${log.task_name || "N/A"}</p>

      <p><strong>Task ID:</strong>
      ${log.task_id || "N/A"}</p>

      <p><strong>Event Type:</strong>
      ${log.event_type || "N/A"}</p>

      <p><strong>Message:</strong>
      ${log.message || "N/A"}</p>

      <p><strong>Result:</strong>
      ${log.result || "N/A"}</p>

      <p><strong>Status:</strong>
      ${log.status || "N/A"}</p>

      <p><strong>Source:</strong>
      ${log.source || "N/A"}</p>

      <p><strong>Created At:</strong>
      ${log.created_at}</p>

    `;

    res.send(
      renderPage(
        "View Log",
        content
      )
    );

  } catch (err) {

    console.error(err);
    res.send(err.message);

  }
});



  return router;
}

module.exports = adminAgentTaskLogs;