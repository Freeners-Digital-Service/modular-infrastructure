const express = require("express");

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function adminSystems(pool, renderPage) {
  const router = express.Router();

  router.get("/systems", async (req, res) => {
    try {
      const systems = await pool.query(`
        SELECT *
        FROM setups
        WHERE item_type = 'system'
        ORDER BY id DESC
      `);

      const systemCards = systems.rows.length
        ? systems.rows
            .map((system) => {
              const status = system.status || "under_configuration";
              const statusColor = status === "active" ? "#16a34a" : "#f97316";

              const viewLink = system.domain
                ? `https://${system.domain}`
                : "#";

              return `
                <details
                  onclick="
                    document.querySelectorAll('details').forEach(el => {
                      if (el !== this) el.removeAttribute('open');
                    });
                  "
                  style="
                    background: linear-gradient(135deg, #0f172a, #1e293b);
                    color: white;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 12px 30px rgba(0,0,0,0.14);
                  "
                >
                  <summary style="
                    list-style: none;
                    cursor: pointer;
                    padding: 18px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                    font-weight: 700;
                  ">
                    <span>
                      ${escapeHtml(system.system_name || "Unnamed System")}
                    </span>

                    <span style="
                      background: ${statusColor};
                      color: white;
                      padding: 6px 12px;
                      border-radius: 999px;
                      font-size: 12px;
                      font-weight: 700;
                      white-space: nowrap;
                    ">
                      ${escapeHtml(status)}
                    </span>
                  </summary>

                  <div style="
                    padding: 18px 20px 20px;
                    border-top: 1px solid rgba(255,255,255,0.08);
                  ">
                    <p style="margin: 0 0 8px 0;">
                      <strong>System ID:</strong> ${escapeHtml(system.system_id || "-")}
                    </p>

                    <p style="margin: 0 0 8px 0;">
                      <strong>Category:</strong> ${escapeHtml(system.category || "-")}
                    </p>

                    <p style="margin: 0 0 8px 0;">
                      <strong>Label:</strong> ${escapeHtml(system.label || "-")}
                    </p>

                    <p style="margin: 0 0 8px 0;">
                      <strong>Business:</strong> ${escapeHtml(system.business_name || "-")}
                    </p>

                    <p style="margin: 0 0 8px 0;">
                      <strong>Email:</strong> ${escapeHtml(system.business_email || "-")}
                    </p>

                    <p style="margin: 0 0 8px 0;">
                      <strong>Phone:</strong> ${escapeHtml(system.phone || "-")}
                    </p>

                    ${
                      system.logo
                        ? `
                      <p style="margin: 14px 0 0 0;">
                        <strong>Logo:</strong><br>
                        <img
                          src="https://modular-infrastructure.onrender.com${escapeHtml(system.logo)}"
                          alt="logo"
                          style="
                            max-width: 100px;
                            margin-top: 10px;
                            border-radius: 14px;
                            background: white;
                            padding: 4px;
                          "
                        />
                      </p>
                    `
                        : ""
                    }

                    <div style="
                      display: flex;
                      gap: 10px;
                      margin-top: 18px;
                      flex-wrap: wrap;
                    ">
                      <a
                        href="/admin/setups/${system.id}/configure"
                        style="
                          background: #10b981;
                          color: white;
                          text-decoration: none;
                          padding: 11px 16px;
                          border-radius: 12px;
                          font-weight: 700;
                        "
                      >
                        Configure
                      </a>

                      <a
                        href="${escapeHtml(viewLink)}"
                        target="_blank"
                        style="
                          background: #334155;
                          color: white;
                          text-decoration: none;
                          padding: 11px 16px;
                          border-radius: 12px;
                          font-weight: 700;
                        "
                      >
                        View
                      </a>
                    </div>
                  </div>
                </details>
              `;
            })
            .join("")
        : `
          <div class="card">
            <h3>No systems found.</h3>
          </div>
        `;

      const content = `
        <h2 style="margin-bottom: 20px;">Systems Management</h2>

        <div style="
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        ">
          ${systemCards}
        </div>
      `;

      res.send(renderPage("Systems", content));
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  });

  return router;
}

module.exports = adminSystems;
