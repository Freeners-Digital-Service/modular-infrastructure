const express = require("express");

function adminDeployments(pool, renderPage) {
  const router = express.Router();

  /* =========================
     Admin Deployments
  ========================= */

  router.get("/deployments", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, system_id, version, status, description, deployed_at
        FROM deployments
        ORDER BY deployed_at DESC
      `);

      let rows = result.rows.map(r => {
        let color = "#999";

        if (r.status === "success") color = "green";
        if (r.status === "failed") color = "red";
        if (r.status === "pending") color = "orange";

        return `
          <tr>
            <td>${r.id}</td>
            <td>${r.system_id}</td>
            <td>${r.version}</td>
            <td style="color:${color}; font-weight:bold;">
              ${r.status}
            </td>
            <td>${r.description || "N/A"}</td>
            <td>${r.deployed_at}</td>
          </tr>
        `;
      }).join("");

      const content = `
        <table>
          <tr>
            <th>ID</th>
            <th>System ID</th>
            <th>Version</th>
            <th>Status</th>
            <th>Description</th>
            <th>Deployed At</th>
          </tr>
          ${rows}
        </table>
      `;

      res.send(renderPage("Deployments", content));

    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminDeployments;