const express = require("express");

function adminAgentCapabilities(pool, renderPage) {
  const router = express.Router();

  /* =========================
   View Capabilities
========================= */

router.get("/agent-capabilities", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        id,
        capability_id,
        agent_name,
        capability_name,
        availability,
        status,
        unlock_level,
        created_at
      FROM agent_capabilities
      ORDER BY created_at DESC
    `);

    let rows = result.rows.map(r => `
      <tr>
        <td>${r.id}</td>
        <td>${r.capability_id || "N/A"}</td>
        <td>${r.agent_name || "N/A"}</td>
        <td>${r.capability_name || "N/A"}</td>
        <td>${r.availability || "N/A"}</td>
        <td>${r.status || "N/A"}</td>
        <td>${r.unlock_level || "N/A"}</td>
        <td>${r.created_at || "N/A"}</td>
      </tr>
    `).join("");

    const content = `
      <table>
        <tr>
          <th>ID</th>
          <th>Capability ID</th>
          <th>Agent</th>
          <th>Capability</th>
          <th>Availability</th>
          <th>Status</th>
          <th>Unlock Level</th>
          <th>Created At</th>
        </tr>
        ${rows}
      </table>
    `;

    res.send(
      renderPage(
        "Agent Capabilities",
        content
      )
    );

  } catch (err) {

    console.error(err);
    res.send(err.message);

  }
});


/* =========================
   Create Capability Form
========================= */

router.get("/agent-capabilities/create", async (req, res) => {
  try {

    const agentsResult = await pool.query(`
      SELECT
        agent_id,
        name
      FROM agents
      ORDER BY name
    `);

    let agentOptions = agentsResult.rows.map(a => `
      <option value="${a.agent_id}">
        ${a.name}
      </option>
    `).join("");

    const content = `
      <form method="POST" action="/agent-capabilities/create">

        <label>Agent</label>
        <select name="agent_id" required>
          <option value="">
            Select Agent
          </option>
          ${agentOptions}
        </select>

        <br><br>

        <label>Capability ID</label>
        <input
          type="text"
          name="capability_id"
          required
        >

        <br><br>

        <label>Capability Name</label>
        <input
          type="text"
          name="capability_name"
          required
        >

        <br><br>

        <label>Capability Description</label>
        <textarea
          name="capability_description"
          rows="4"
        ></textarea>

        <br><br>

        <label>Billing Impact</label>
        <input
          type="number"
          step="0.01"
          name="billing_impact"
          value="0"
        >

        <br><br>

        <label>Availability</label>
        <select name="availability">

          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>

          <option value="premium">
            Premium
          </option>

          <option value="enterprise">
            Enterprise
          </option>

        </select>

        <br><br>

        <label>Unlock Level</label>
        <input
          type="number"
          name="unlock_level"
          value="1"
        >

        <br><br>

        <button type="submit">
          Save Capability
        </button>

      </form>
    `;

    res.send(
      renderPage(
        "Create Capability",
        content
      )
    );

  } catch (err) {

    console.error(err);
    res.send(err.message);

  }
});



/* =========================
   Save Capability
========================= */

router.post("/agent-capabilities/create", async (req, res) => {
  try {

    const {
      agent_id,
      capability_id,
      capability_name,
      capability_description,
      billing_impact,
      availability,
      unlock_level
    } = req.body;

    const agentResult = await pool.query(
      `SELECT *
       FROM agents
       WHERE agent_id = $1`,
      [agent_id]
    );

    if (agentResult.rows.length === 0) {
      return res.send("Agent not found");
    }

    const agent = agentResult.rows[0];

    await pool.query(
      `INSERT INTO agent_capabilities (
        capability_id,
        agent_id,
        agent_name,
        capability_name,
        capability_description,
        billing_impact,
        availability,
        status,
        unlock_level
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9
      )`,
      [
        capability_id,
        agent.agent_id,
        agent.name,
        capability_name,
        capability_description,
        billing_impact,
        availability,
        "active",
        unlock_level
      ]
    );

    res.redirect("/agent-capabilities");

  } catch (err) {

    console.error(err);
    res.send(err.message);

  }
});


/* =========================
   View Capability
========================= */

router.get("/agent-capabilities/view/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM agent_capabilities
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.send("Capability not found");
    }

    const capability = result.rows[0];

    const content = `
      <p><strong>Capability ID:</strong>
      ${capability.capability_id || "N/A"}</p>

      <p><strong>Agent ID:</strong>
      ${capability.agent_id || "N/A"}</p>

      <p><strong>Agent Name:</strong>
      ${capability.agent_name || "N/A"}</p>

      <p><strong>Capability Name:</strong>
      ${capability.capability_name || "N/A"}</p>

      <p><strong>Description:</strong>
      ${capability.capability_description || "N/A"}</p>

      <p><strong>Billing Impact:</strong>
      ${capability.billing_impact || "0"}</p>

      <p><strong>Availability:</strong>
      ${capability.availability || "N/A"}</p>

      <p><strong>Status:</strong>
      ${capability.status || "N/A"}</p>

      <p><strong>Unlock Level:</strong>
      ${capability.unlock_level || "N/A"}</p>

      <p><strong>Created At:</strong>
      ${capability.created_at}</p>

      <p><strong>Updated At:</strong>
      ${capability.updated_at}</p>
    `;

    res.send(
      renderPage(
        "View Capability",
        content
      )
    );

  } catch (err) {

    console.error(err);
    res.send(err.message);

  }
});



/* =========================
   Edit Capability
========================= */

router.get("/agent-capabilities/edit/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM agent_capabilities
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.send("Capability not found");
    }

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);
    res.send(err.message);

  }
});



/* =========================
   Update Capability
========================= */

router.post("/agent-capabilities/update/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const {
      capability_name,
      capability_description,
      billing_impact,
      availability,
      status,
      unlock_level
    } = req.body;

    await pool.query(
      `UPDATE agent_capabilities
       SET
         capability_name = $1,
         capability_description = $2,
         billing_impact = $3,
         availability = $4,
         status = $5,
         unlock_level = $6,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $7`,
      [
        capability_name,
        capability_description,
        billing_impact,
        availability,
        status,
        unlock_level,
        id
      ]
    );

    res.json({
      success: true,
      message: "Capability updated successfully"
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

module.exports = adminAgentCapabilities;
