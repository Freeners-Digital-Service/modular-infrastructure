const express = require("express");

function agentSetupRoutes(pool) {

  const router = express.Router();


/* =========================
   SAVE AGENT SETUP (DRAFT)
========================= */

router.post("/save", async (req, res) => {
  try {
    const {
      client_id,
      agent_id,
      agent_name,

      target_type,
      target_reference,

      website_name,
      website_url,
      website_platform,

      system_name,
      system_url,
      system_type,

      platform_name,
      account_name,
      profile_url,

      agent_behavior,
      additional_information,
      contact_method
    } = req.body;

    if (!client_id || !agent_id) {
      return res.status(400).json({
        error: "client_id and agent_id are required"
      });
    }

          const behaviorValue = Array.isArray(agent_behavior)
        ? agent_behavior.join(", ")
        : agent_behavior || null;

      const catalog = await pool.query(
        `SELECT name, monthly_fee
        FROM agents_catalog
        WHERE id = $1`,
        [agent_id]
      );

      const catalogAgentName =
        agent_name || catalog.rows[0]?.name || null;

      const catalogMonthlyFee =
        catalog.rows[0]?.monthly_fee || 0;

      const clientResult = await pool.query(
        `SELECT name
        FROM clients
        WHERE id = $1`,
        [client_id]
      );

      const client_name =
        clientResult.rows[0]?.name || null;

      const existing = await pool.query(
        `SELECT id
        FROM client_agents
        WHERE client_id = $1 AND agent_id = $2`,
        [client_id, agent_id]
      );


    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE client_agents SET
          agent_name = COALESCE($1, agent_name),
          client_name = COALESCE($2, client_name),

          target_type = COALESCE($3, target_type),
          target_reference = COALESCE($4, target_reference),

          website_name = COALESCE($5, website_name),
          website_url = COALESCE($6, website_url),
          website_platform = COALESCE($7, website_platform),

          system_name = COALESCE($8, system_name),
          system_url = COALESCE($9, system_url),
          system_type = COALESCE($10, system_type),

          platform_name = COALESCE($11, platform_name),
          account_name = COALESCE($12, account_name),
          profile_url = COALESCE($13, profile_url),

          agent_behavior = COALESCE($14, agent_behavior),
          additional_information = COALESCE($15, additional_information),
          contact_method = COALESCE($16, contact_method),

          setup_submitted = FALSE,
          setup_submitted_at = NULL,
          configuration_status = 'draft'
         WHERE client_id = $17 AND agent_id = $18`,
        [
          catalogAgentName,
          client_name,
          target_type,
          target_reference,

          website_name || null,
          website_url || null,
          website_platform || null,

          system_name || null,
          system_url || null,
          system_type || null,

          platform_name || null,
          account_name || null,
          profile_url || null,

          behaviorValue,
          additional_information || null,
          contact_method || null,

          client_id,
          agent_id
        ]
      );
    } else {
      await pool.query(
        `INSERT INTO client_agents (
          client_id,
          client_name,
          system_id,
          module_id,
          agent_id,
          agent_name,

          target_type,
          target_reference,

          website_name,
          website_url,
          website_platform,

          system_name,
          system_url,
          system_type,

          platform_name,
          account_name,
          profile_url,

          agent_behavior,
          additional_information,
          contact_method,

          setup_submitted,
          setup_submitted_at,
          configuration_status,
          status,

          monthly_fee,
          locked_price
        ) VALUES (
          $1,
          $2,
          NULL,
          NULL,
          $3,
          $4,

          $5,
          $6,

          $7,
          $8,
          $9,

          $10,
          $11,
          $12,

          $13,
          $14,
          $15,

          $16,
          $17,
          $18,

          FALSE,
          NULL,
          'draft',
          'active',

          $19,
          $20
        )`,
        [
          client_id,
          client_name,

          agent_id,
          catalogAgentName,

          target_type,
          target_reference,

          website_name || null,
          website_url || null,
          website_platform || null,

          system_name || null,
          system_url || null,
          system_type || null,

          platform_name || null,
          account_name || null,
          profile_url || null,

          behaviorValue,
          additional_information || null,
          contact_method || null,

          catalogMonthlyFee,
          catalogMonthlyFee
        ]
      );
    }

    res.json({
      success: true
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Agent draft save failed"
    });
  }
});

/* =========================
   LOAD AGENT SETUP
========================= */

router.get("/load", async (req, res) => {
  try {

    const {
      client_id,
      agent_id
    } = req.query;

    const result = await pool.query(
      `SELECT *
       FROM client_agents
       WHERE client_id = $1
       AND agent_id = $2`,
      [client_id, agent_id]
    );

    if (result.rows.length === 0) {
      return res.json({
        found: false
      });
    }

    res.json({
      found: true,
      setup: result.rows[0]
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to load agent setup"
    });

  }
});


/* =========================
   SUBMIT AGENT SETUP
========================= */

router.post("/submit", async (req, res) => {
  try {

    const {
      client_id,
      agent_id
    } = req.body;

    const existing = await pool.query(
      `SELECT *
       FROM client_agents
       WHERE client_id = $1
       AND agent_id = $2`,
      [client_id, agent_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        error: "Agent setup not found"
      });
    }

    await pool.query(
  `UPDATE client_agents
   SET
     setup_submitted = TRUE,
     setup_submitted_at = CURRENT_TIMESTAMP,
     configuration_status = 'under_configuration'
   WHERE client_id = $1
   AND agent_id = $2`,
  [client_id, agent_id]
);

    res.json({
      success: true,
      message: "Agent setup submitted successfully"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Agent setup submission failed"
    });

  }
});
 return router;
}

module.exports = agentSetupRoutes;