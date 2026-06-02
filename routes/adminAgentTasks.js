const express = require("express");

function adminAgentTasks(pool, renderPage) {
  const router = express.Router();

  /* =========================
     Admin Agent Tasks
  ========================= */

router.get("/agent-tasks", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        id,
        task_id,
        agent_id,
        agent_name,
        capability_id,
        capability_name,
        task_name,
        status,
        unlock_level,
        created_at
      FROM agent_tasks
      ORDER BY created_at DESC
    `);

    let rows = result.rows.map(r => `
      <tr>
        <td>${r.id}</td>
        <td>${r.agent_name || "N/A"}</td>
        <td>${r.agent_id || "N/A"}</td>
        <td>${r.capability_name || "N/A"}</td>
        <td>${r.capability_id || "N/A"}</td>
        <td>${r.task_name || "N/A"}</td>
        <td>${r.task_id || "N/A"}</td>
        <td>${r.status || "N/A"}</td>
        <td>${r.unlock_level || "N/A"}</td>
        <td>${r.created_at || "N/A"}</td>
      </tr>
    `).join("");

    const content = `
    
          <tr>
            <th>ID</th>
            <th>Agent Name</th>
            <th>Agent ID</th>
            <th>Capability Name</th>
            <th>Capability ID</th>
            <th>Task Name</th>
            <th>Task ID</th>
            <th>Status</th>
            <th>Unlock Level</th>
            <th>Created At</th>
          </tr>

          ${rows}

        </table>
      </div>
    `;

    res.send(renderPage("Agent Tasks", content));

  } catch (err) {

    console.error(err);
    res.send(err.message);

  }
});


  /* =========================
   View Task
========================= */

router.get("/agent-tasks/view/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM agent_tasks
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.send("Task not found");
    }

    const task = result.rows[0];

    const content = `
      <h3>${task.task_name || "N/A"}</h3>

      <p><strong>Agent Name:</strong>
      ${task.agent_name || "N/A"}</p>

      <p><strong>Agent ID:</strong>
      ${task.agent_id || "N/A"}</p>

      <p><strong>Task Name:</strong>
      ${task.task_name || "N/A"}</p>

      <p><strong>Task ID:</strong>
      ${task.task_id || "N/A"}</p>

      <p><strong>Capability Name:</strong>
      ${task.capability_name || "N/A"}</p>

      <p><strong>Capability ID:</strong>
      ${task.capability_id || "N/A"}</p>

      <p><strong>Description:</strong>
      ${task.task_description || "N/A"}</p>

      <p><strong>Billing Impact:</strong>
      ${task.billing_impact || "0"}</p>

      <p><strong>Availability:</strong>
      ${task.availability || "N/A"}</p>

      <p><strong>Status:</strong>
      ${task.status || "N/A"}</p>

      <p><strong>Unlock Level:</strong>
      ${task.unlock_level || "N/A"}</p>

      <p><strong>Result:</strong>
      ${task.result || "N/A"}</p>

      <p><strong>Created At:</strong>
      ${task.created_at}</p>

      <p><strong>Updated At:</strong>
      ${task.updated_at}</p>
    `;

    res.send(renderPage("View Task", content));

  } catch (err) {

    console.error(err);
    res.send(err.message);

  }
});




/* =========================
   Edit Task
========================= */

router.get("/agent-tasks/edit/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM agent_tasks
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.send("Task not found");
    }

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);
    res.send(err.message);

  }
});


/* =========================
   Update Task
========================= */

router.post("/agent-tasks/update/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const {
      capability_id,
      capability_name,
      task_name,
      task_description,
      billing_impact,
      availability,
      status,
      unlock_level,
      result
    } = req.body;

    await pool.query(
      `UPDATE agent_tasks
       SET
         capability_id = $1,
         capability_name = $2,
         task_name = $3,
         task_description = $4,
         billing_impact = $5,
         availability = $6,
         status = $7,
         unlock_level = $8,
         result = $9,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $10`,
      [
        capability_id,
        capability_name,
        task_name,
        task_description,
        billing_impact,
        availability,
        status,
        unlock_level,
        result,
        id
      ]
    );

    res.json({
      success: true,
      message: "Task updated successfully"
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

module.exports = adminAgentTasks;
