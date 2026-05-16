
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
        ? setups.rows
            .map((setup) => {
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
                <details style="
                  background:#ffffff;
                  border:1px solid #e5e7eb;
                  border-radius:18px;
                  box-shadow:0 10px 30px rgba(0,0,0,0.05);
                  overflow:hidden;
                ">
                  <summary style="
                    list-style:none;
                    cursor:pointer;
                    padding:18px 20px;
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:16px;
                    font-weight:700;
                    color:#111827;
                  ">
                    <span>${escapeHtml((setup.item_type || "setup").toUpperCase())}</span>
                    <span style="
                      display:inline-block;
                      padding:6px 12px;
                      border-radius:999px;
                      color:#fff;
                      background:${statusColor};
                      font-size:12px;
                      font-weight:700;
                      white-space:nowrap;
                    ">
                      ${escapeHtml(status)}
                    </span>
                  </summary>

                  <div style="
                    padding:20px;
                    border-top:1px solid #eef2f7;
                    background:#fafafa;
                  ">
                    <p><strong>System ID:</strong> ${escapeHtml(setup.system_id || "-")}</p>
                    <p><strong>Website ID:</strong> ${escapeHtml(setup.website_id || "-")}</p>
                    <p><strong>System Name:</strong> ${escapeHtml(setup.system_name || "-")}</p>
                    <p><strong>Website Name:</strong> ${escapeHtml(setup.website_name || "-")}</p>
                    <p><strong>Business Name:</strong> ${escapeHtml(setup.business_name || "-")}</p>
                    <p><strong>Business Email:</strong> ${escapeHtml(setup.business_email || "-")}</p>
                    <p><strong>Phone:</strong> ${escapeHtml(setup.phone || "-")}</p>
                    <p><strong>Category:</strong> ${escapeHtml(setup.category || "-")}</p>
                    <p><strong>Label:</strong> ${escapeHtml(setup.label || "-")}</p>
                    <p><strong>Brand Color:</strong> ${escapeHtml(setup.brand_color || "-")}</p>
                    <p><strong>Domain:</strong> ${escapeHtml(setup.domain || "-")}</p>

                    ${setup.logo ? `<p><strong>Logo:</strong><br><img src="${escapeHtml(setup.logo)}" alt="logo" style="max-width:120px; margin-top:10px; border-radius:10px;"></p>` : ""}

                    <div style="display:flex; gap:10px; margin-top:16px; flex-wrap:wrap;">
                      <a href="/admin/setups/${setup.id}/configure" class="btn btn-primary">
                        Configure
                      </a>

                      <a href="${escapeHtml(viewLink)}" target="_blank" class="btn btn-secondary">
                        View
                      </a>
                    </div>
                  </div>
                </details>
              `;
            })
            .join("")
        : `<p style="background:#fff; padding:18px; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.05);">No setup requests yet.</p>`;

      const content = `
        <div class="stats-grid">
          <div class="card">
            <h2>Clients</h2>
            <p>${clients.rows[0].count}</p>
          </div>

          <div class="card">
            <h2>Systems</h2>
            <p>${systems.rows[0].count}</p>
          </div>

          <div class="card">
            <h2>Modules</h2>
            <p>${modules.rows[0].count}</p>
          </div>

          <div class="card">
            <h2>Agents</h2>
            <p>${agents.rows[0].count}</p>
          </div>
        </div>

        <div style="margin-top:10px;">
          <h2 style="margin:0 0 16px 0; color:#111827;">Setup Requests</h2>
          <div style="
            display:grid;
            grid-template-columns:repeat(3, minmax(0, 1fr));
            gap:16px;
          ">
            ${setupCards}
          </div>
        </div>
      `;

      res.send(renderPage("Dashboard", content));
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  });

  return router;
}

module.exports = adminMain;