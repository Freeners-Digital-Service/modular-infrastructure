const express = require("express");

function adminPricing(pool, renderPage) {
  const router = express.Router();

  /* =========================
     Admin Pricing
  ========================= */

  router.get("/pricing", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, system_id, module_id, agent_id, setup_fee, price, billing_cycle
        FROM pricing
        ORDER BY id DESC
      `);

      let rows = result.rows.map(r => {
        let type = "N/A";

        if (r.system_id) type = "System";
        else if (r.module_id) type = "Module";
        else if (r.agent_id) type = "Agent";

        return `
          <tr>
            <td>${r.id}</td>
            <td>${type}</td>
            <td>${r.system_id || r.module_id || r.agent_id}</td>
            <td>${r.setup_fee || "—"}</td>
            <td>${r.price || "—"}</td>
            <td>${r.billing_cycle || "—"}</td>
          </tr>
        `;
      }).join("");

      const content = `
        <table>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Reference ID</th>
            <th>Setup Fee</th>
            <th>Monthly Price</th>
            <th>Billing Cycle</th>
          </tr>
          ${rows}
        </table>
      `;

      res.send(renderPage("Pricing", content));

    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminPricing;