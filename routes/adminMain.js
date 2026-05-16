
const express = require("express");

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function adminMain(pool, renderPage) {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const clients = await pool.query("SELECT COUNT(*) FROM clients");
      const systems = await pool.query("SELECT COUNT(*) FROM systems");
      const modules = await pool.query("SELECT COUNT(*) FROM modules");
      const agents = await pool.query("SELECT COUNT(*) FROM agents");

      const setups = await pool.query(`
        SELECT *
        FROM setups
        ORDER BY id DESC
      `);

      const setupCards = setups.rows.length
        ? setups.rows.map((setup) => {
            const status = setup.status || "under_configuration";
            const statusColor =
              status === "active"
                ? "#16a34a"
                : status === "under_configuration"
                ? "#f97316"
                : "#6b7280";

            const viewLink = setup.domain
              ? `https://${setup.domain}`
              : setup.website_url || setup.system_url || "#";

            return `
              <div style="
                padding:20px;
                background:#f9f9f9;
                border:1px solid #ddd;
                border-radius:12px;
                margin-bottom:16px;
              ">
                <h3 style="margin:0 0 10px 0;">
                  ${escapeHtml(setup.item_type || "setup").toUpperCase()}
                </h3>

                <p><strong>System ID:</strong> ${escapeHtml(setup.system_id || "-")}</p>
                <p><strong>Website ID:</strong> ${escapeHtml(setup.website_id || "-")}</p>
                <p><strong>System Name:</strong> ${escapeHtml(setup.system_name || "-")}</p>
                <p><strong>Website Name:</strong> ${escapeHtml(setup.website_name || "-")}</p>
                <p><strong>Business Name:</strong> ${escapeHtml(setup.business_name || "-")}</p>
                <p><strong>Email:</strong> ${escapeHtml(setup.business_email || "-")}</p>
                <p><strong>Phone:</strong> ${escapeHtml(setup.phone || "-")}</p>
                <p><strong>Category:</strong> ${escapeHtml(setup.category || "-")}</p>
                <p><strong>Label:</strong> ${escapeHtml(setup.label || "-")}</p>
                <p><strong>Brand Color:</strong> ${escapeHtml(setup.brand_color || "-")}</p>
                <p><strong>Domain:</strong> ${escapeHtml(setup.domain || "-")}</p>

                <p>
                  <strong>Status:</strong>
                  <span style="
                    display:inline-block;
                    padding:4px 10px;
                    border-radius:999px;
                    color:white;
                    background:${statusColor};
                    margin-left:6px;
                    font-size:13px;
                  ">
                    ${escapeHtml(status)}
                  </span>
                </p>

                ${setup.logo ? `<p><strong>Logo:</strong><br><img src="${escapeHtml(setup.logo)}" alt="logo" style="max-width:120px; margin-top:8px;"></p>` : ""}

                <div style="display:flex; gap:10px; margin-top:14px; flex-wrap:wrap;">
                  <a href="/admin/setups/${setup.id}/configure" style="
                    padding:10px 14px;
                    background:#111827;
                    color:white;
                    text-decoration:none;
                    border-radius:8px;
                  ">
                    Configure
                  </a>

                  <a href="${escapeHtml(viewLink)}" target="_blank" style="
                    padding:10px 14px;
                    background:#2563eb;
                    color:white;
                    text-decoration:none;
                    border-radius:8px;
                  ">
                    View
                  </a>
                </div>
              </div>
            `;
          }).join("")
        : `<p>No setup requests yet.</p>`;

      const content = `
        <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:30px;">
          
          <div style="padding:20px; background:#f4f4f4;">
            <h2>Clients</h2>
            <p>${clients.rows[0].count}</p>
          </div>

          <div style="padding:20px; background:#f4f4f4;">
            <h2>Systems</h2>
            <p>${systems.rows[0].count}</p>
          </div>

          <div style="padding:20px; background:#f4f4f4;">
            <h2>Modules</h2>
            <p>${modules.rows[0].count}</p>
          </div>

          <div style="padding:20px; background:#f4f4f4;">
            <h2>Agents</h2>
            <p>${agents.rows[0].count}</p>
          </div>

        </div>

        <div style="margin-top:30px;">
          <h2 style="margin-bottom:16px;">Setup Requests</h2>
          ${setupCards}
        </div>
      `;

      res.send(renderPage("Dashboard", content));
    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminMain;