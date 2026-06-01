const express = require("express");

function adminAgentTaskCreate(pool, renderPage) {
  const router = express.Router();

/* =========================
   Create Task Form
========================= */

router.get("/agent-tasks/create", async (req, res) => {
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
      <form method="POST" action="/admin/agent-tasks/create">

        <label>Agent</label>
        <select
          name="agent_id"
          id="agent_id"
          required
        >
          <option value="">
            Select Agent
          </option>
          ${agentOptions}
        </select>

        <br><br>

        <label>Capability</label>
        <select
          name="capability_id"
          id="capability_id"
          required
        >
          <option value="">
            Select Capability
          </option>
        </select>

        <br><br>

        <label>Task ID</label>
        <input
          type="text"
          name="task_id"
          required
        >

        <br><br>

        <label>Task Name</label>
        <input
          type="text"
          name="task_name"
          required
        >

        <br><br>

        <label>Task Description</label>
        <textarea
          name="task_description"
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
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="premium">Premium</option>
          <option value="enterprise">Enterprise</option>
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
          Save Task
        </button>

           <script>

document.getElementById("agent_id").addEventListener(
  "change",
  async function () {

    const agentId = this.value;

    const capabilityDropdown =
      document.getElementById("capability_id");

    capabilityDropdown.innerHTML =
      "<option value=''>Loading...</option>";

    try {

      const response = await fetch(
        "/admin/agent-tasks/capabilities/" + agentId
      );

      const capabilities =
        await response.json();

      capabilityDropdown.innerHTML =
        "<option value=''>Select Capability</option>";

      capabilities.forEach(function (capability) {

        capabilityDropdown.innerHTML +=
          "<option value='" +
          capability.capability_id +
          "'>" +
          capability.capability_name +
          "</option>";

      });

    } catch (err) {

      console.error(err);

      capabilityDropdown.innerHTML =
        "<option value=''>Error Loading Capabilities</option>";

    }

  }
);

</script>


      </form>
    `;

    res.send(
      renderPage(
        "Create Agent Task",
        content
      )
    );

  } catch (err) {

    console.error(err);
    res.send(err.message);

  }
});

/* =========================
   Load Agent Capabilities
========================= */

router.get("/agent-tasks/capabilities/:agent_id", async (req, res) => {
  try {

    const { agent_id } = req.params;

    const result = await pool.query(
      `SELECT
         capability_id,
         capability_name
       FROM agent_capabilities
       WHERE agent_id = $1
       ORDER BY capability_name`,
      [agent_id]
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }
});

/* =========================
   Save Task
========================= */

router.post("/agent-tasks/create", async (req, res) => {
  try {

    const {
      agent_id,
      capability_id,
      task_id,
      task_name,
      task_description,
      billing_impact,
      availability,
      unlock_level
    } = req.body;

    const capabilityResult = await pool.query(
      `SELECT
         agent_id,
         agent_name,
         capability_id,
         capability_name
       FROM agent_capabilities
       WHERE capability_id = $1`,
      [capability_id]
    );

    if (capabilityResult.rows.length === 0) {
      return res.send("Capability not found");
    }

    const capability =
      capabilityResult.rows[0];

    await pool.query(
      `INSERT INTO agent_tasks (
        task_id,
        agent_id,
        agent_name,
        capability_id,
        capability_name,
        task_name,
        task_description,
        billing_impact,
        availability,
        status,
        unlock_level
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
      )`,
      [
        task_id,
        capability.agent_id,
        capability.agent_name,
        capability.capability_id,
        capability.capability_name,
        task_name,
        task_description,
        billing_impact,
        availability,
        "active",
        unlock_level
      ]
    );

    res.redirect("/admin/agent-tasks");

  } catch (err) {

    console.error(err);
    res.send(err.message);

  }
});


  return router;
}

module.exports = adminAgentTaskCreate;
