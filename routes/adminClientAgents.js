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
        ca.target_type,
        ca.agent_id,
        ca.status,
        ca.activated_at,

        c.name AS client,
        s.name AS system,
        ca.target_type AS target,
        a.name AS agent

      FROM client_agents ca

      LEFT JOIN clients c ON ca.client_id = c.id
      LEFT JOIN systems s ON ca.system_id = s.id
      LEFT JOIN agents a ON ca.agent_id = a.agent_id

      ORDER BY ca.activated_at DESC
    `);

    let rows = result.rows.map(r => {

      const actionButton =
        r.status === "active"
          ? `<a href="/admin/agent-task-assignments">View</a>`
          : `<a href="/admin/client-agents/activate/${r.id}">Activate</a>`;

      return `
        <tr>
          <td>${r.id}</td>
          <td>${r.client || r.client_id}</td>
          <td>${r.system || r.system_id}</td>
          <td>${r.target_type || "-"}</td>
          <td>${r.agent || r.agent_id}</td>
          <td>${r.status}</td>
          <td>${r.activated_at || "-"}</td>
          <td>${actionButton}</td>
        </tr>
      `;

    }).join("");

    const content = `
      <table>
        <tr>
          <th>ID</th>
          <th>Client</th>
          <th>System</th>
          <th>Target</th>
          <th>Agent</th>
          <th>Status</th>
          <th>Activated At</th>
          <th>Actions</th>
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


  /* =========================
   Pending Agent Setups
========================= */

router.get("/client-agents/pending", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        ca.id,
        ca.client_id,
        ca.agent_id,
        ca.agent_name,
        ca.target_type,
        ca.configuration_status,
        ca.setup_submitted,
        ca.setup_submitted_at,

        c.name AS client

      FROM client_agents ca

      LEFT JOIN clients c
      ON ca.client_id = c.id

      WHERE
        ca.setup_submitted = TRUE
        AND ca.configuration_status = 'pending'

      ORDER BY ca.setup_submitted_at DESC
    `);

    let rows = result.rows.map(r => `
      <tr>
        <td>${r.id}</td>
        <td>${r.client || r.client_id}</td>
        <td>${r.agent_name || r.agent_id}</td>
        <td>${r.target_type || "-"}</td>
        <td>${r.configuration_status}</td>
        <td>${r.setup_submitted_at || "-"}</td>
      </tr>
    `).join("");

    const content = `
      <h2>Pending Agent Setups</h2>

      <table>
        <tr>
          <th>ID</th>
          <th>Client</th>
          <th>Agent</th>
          <th>Target</th>
          <th>Status</th>
          <th>Submitted</th>
        </tr>

        ${rows}
      </table>
    `;

    res.send(
      renderPage(
        "Pending Agent Setups",
        content
      )
    );

  } catch (err) {

    console.error(err);
    res.send(err.message);

  }
});




/* =========================
   Approve Agent Setup
========================= */

router.get("/client-agents/approve/:id", async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      `UPDATE client_agents
       SET configuration_status = 'approved'
       WHERE id = $1`,
      [id]
    );

    res.redirect("/client-agents/pending");

  } catch (err) {

    console.error(err);
    res.send(err.message);

  }
});


/* =========================
   Activate Agent
========================= */

router.get("/client-agents/activate/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const clientAgentResult = await pool.query(
      `SELECT *
       FROM client_agents
       WHERE id = $1`,
      [id]
    );

    if (clientAgentResult.rows.length === 0) {
      return res.send("Client agent not found");
    }

    const clientAgent =
      clientAgentResult.rows[0];

    const tasksResult = await pool.query(
      `SELECT *
       FROM agent_tasks
       WHERE agent_id = $1`,
      [clientAgent.agent_id]
    );

    for (const task of tasksResult.rows) {

      const existingAssignment = await pool.query(
        `SELECT id
         FROM agent_task_assignments
         WHERE
           client_id = $1
           AND agent_id = $2
           AND task_id = $3`,
        [
          clientAgent.client_id,
          clientAgent.agent_id,
          task.task_id
        ]
      );

      if (existingAssignment.rows.length > 0) {
        continue;
      }

      await pool.query(
        `INSERT INTO agent_task_assignments (
          client_name,
          client_id,
          agent_name,
          agent_id,
          capability_name,
          capability_id,
          task_name,
          task_id,
          is_base_task,
          unlock_level,
          status
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
        )`,
        [
          clientAgent.client_name,
          clientAgent.client_id,

          clientAgent.agent_name,
          clientAgent.agent_id,

          task.capability_name,
          task.capability_id,

          task.task_name,
          task.task_id,

          true,

          task.unlock_level || 1,

          "active"
        ]
      );

      await pool.query(
        `INSERT INTO agent_task_logs (
          client_name,
          client_id,
          agent_name,
          agent_id,
          task_name,
          task_id,
          event_type,
          message,
          result,
          status,
          source
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
        )`,
        [
          clientAgent.client_name,
          clientAgent.client_id,

          clientAgent.agent_name,
          clientAgent.agent_id,

          task.task_name,
          task.task_id,

          "TASK_ASSIGNED",

          "Task assigned during agent activation",

          "Assignment created",

          "active",

          "activation"
        ]
      );

    }

    await pool.query(
      `UPDATE client_agents
       SET
         status = 'active',
         approved_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [id]
    );

    res.redirect("/admin/client-agents");

  } catch (err) {

    console.error(err);
    res.send(err.message);

  }
});




/* =========================
   Suspend Agent
========================= */

router.get("/client-agents/suspend/:id", async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      `UPDATE client_agents
       SET status = 'suspended'
       WHERE id = $1`,
      [id]
    );

    res.redirect("/client-agents");

  } catch (err) {

    console.error(err);
    res.send(err.message);

  }
});



/* =========================
   Edit Agent Setup
========================= */

router.get("/client-agents/edit/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM client_agents
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.send("Agent setup not found");
    }

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);
    res.send(err.message);

  }
});



/* =========================
   Update Agent Setup
========================= */

router.post("/client-agents/update/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const {
      target_type,
      target_reference,
      agent_behavior,
      additional_information,
      contact_method,
      status,
      configuration_status
    } = req.body;

    await pool.query(
      `UPDATE client_agents
       SET
         target_type = $1,
         target_reference = $2,
         agent_behavior = $3,
         additional_information = $4,
         contact_method = $5,
         status = $6,
         configuration_status = $7
       WHERE id = $8`,
      [
        target_type,
        target_reference,
        agent_behavior,
        additional_information,
        contact_method,
        status,
        configuration_status,
        id
      ]
    );

    res.json({
      success: true,
      message: "Agent setup updated"
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

module.exports = adminClientAgents;