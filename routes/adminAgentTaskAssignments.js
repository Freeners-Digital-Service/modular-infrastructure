const express = require("express");

function adminAgentTaskAssignments(pool, renderPage) {

  const router = express.Router();

  /* =========================
   Agent Task Assignments
========================= */

router.get("/agent-task-assignments", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        id,
        agent_id,
        capability_id,
        task_id,
        task_name,
        is_base_task,
        status,
        created_at
      FROM agent_task_assignments
      ORDER BY created_at DESC
    `);

    let rows = result.rows.map(r => `
      <tr>
        <td>${r.id}</td>
        <td>${r.agent_id || "N/A"}</td>
        <td>${r.capability_id || "N/A"}</td>
        <td>${r.task_id || "N/A"}</td>
        <td>${r.task_name || "N/A"}</td>
        <td>${r.is_base_task}</td>
        <td>${r.status || "N/A"}</td>
        <td>${r.created_at || "N/A"}</td>
      </tr>
    `).join("");

    const content = `
      <table>
        <tr>
          <th>ID</th>
          <th>Agent ID</th>
          <th>Capability ID</th>
          <th>Task ID</th>
          <th>Task Name</th>
          <th>Base Task</th>
          <th>Status</th>
          <th>Created At</th>
        </tr>
        ${rows}
      </table>
    `;

    res.send(
      renderPage(
        "Agent Task Assignments",
        content
      )
    );

  } catch (err) {

    console.error(err);
    res.send(err.message);

  }
});

/* =========================
   View Assignment
========================= */

router.get("/agent-task-assignments/view/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM agent_task_assignments
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.send("Assignment not found");
    }

    const assignment = result.rows[0];

    const content = `
      <p><strong>Agent ID:</strong>
      ${assignment.agent_id || "N/A"}</p>

      <p><strong>Capability ID:</strong>
      ${assignment.capability_id || "N/A"}</p>

      <p><strong>Task ID:</strong>
      ${assignment.task_id || "N/A"}</p>

      <p><strong>Task Name:</strong>
      ${assignment.task_name || "N/A"}</p>

      <p><strong>Base Task:</strong>
      ${assignment.is_base_task}</p>

      <p><strong>Unlock Level:</strong>
      ${assignment.unlock_level}</p>

      <p><strong>Status:</strong>
      ${assignment.status || "N/A"}</p>

      <p><strong>Created At:</strong>
      ${assignment.created_at}</p>

      <p><strong>Updated At:</strong>
      ${assignment.updated_at}</p>
    `;

    res.send(
      renderPage(
        "View Assignment",
        content
      )
    );

  } catch (err) {

    console.error(err);
    res.send(err.message);

  }
});

/* =========================
   Edit Assignment
========================= */

router.get("/agent-task-assignments/edit/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM agent_task_assignments
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.send("Assignment not found");
    }

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);
    res.send(err.message);

  }
});

/* =========================
   Update Assignment
========================= */

router.post("/agent-task-assignments/update/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const {
      capability_id,
      task_id,
      task_name,
      is_base_task,
      unlock_level,
      status
    } = req.body;

    await pool.query(
      `UPDATE agent_task_assignments
       SET
         capability_id = $1,
         task_id = $2,
         task_name = $3,
         is_base_task = $4,
         unlock_level = $5,
         status = $6,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $7`,
      [
        capability_id,
        task_id,
        task_name,
        is_base_task,
        unlock_level,
        status,
        id
      ]
    );

    res.json({
      success: true,
      message: "Assignment updated successfully"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
});

  return router;
}

module.exports = adminAgentTaskAssignments;