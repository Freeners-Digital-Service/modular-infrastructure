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
        ? systems.rows.map((system) => {

          const status =
            system.status ||
            "under_configuration";

          const statusColor =
            status === "active"
            ? "#059669"
            : "#dc2626";

          return `
            <div style="
              background:linear-gradient(
              135deg,
              #0f172a,
              #1e293b
              );
              color:white;
              border-radius:22px;
              overflow:hidden;
              box-shadow:
              0 15px 35px rgba(0,0,0,0.15);
              transition:.3s ease;
            ">

              <div style="
                padding:20px;
                border-bottom:
                1px solid rgba(255,255,255,0.08);
              ">

                <div style="
                  display:flex;
                  justify-content:space-between;
                  align-items:center;
                  gap:12px;
                ">

                  <div>
                    <h2 style="
                      margin:0;
                      font-size:20px;
                    ">
                      ${escapeHtml(
                        system.system_name ||
                        "Unnamed System"
                      )}
                    </h2>

                    <p style="
                      margin-top:6px;
                      opacity:.8;
                    ">
                      ${escapeHtml(
                        system.category ||
                        "No Category"
                      )}
                    </p>
                  </div>

                  <span style="
                    background:${statusColor};
                    padding:8px 14px;
                    border-radius:999px;
                    font-size:12px;
                    font-weight:bold;
                  ">
                    ${escapeHtml(status)}
                  </span>

                </div>

              </div>

              <div style="
                padding:20px;
              ">

                <div style="
                  display:grid;
                  grid-template-columns:
                  repeat(2,1fr);
                  gap:12px;
                  margin-bottom:20px;
                ">

                  <div>
                    <small>System ID</small>
                    <p>${escapeHtml(system.system_id || "-")}</p>
                  </div>

                  <div>
                    <small>Label</small>
                    <p>${escapeHtml(system.label || "-")}</p>
                  </div>

                  <div>
                    <small>Business</small>
                    <p>${escapeHtml(system.business_name || "-")}</p>
                  </div>

                  <div>
                    <small>Email</small>
                    <p>${escapeHtml(system.business_email || "-")}</p>
                  </div>

                </div>

                ${system.logo ? `
                <div style="
                  margin-bottom:20px;
                ">
                  <img
                  src="https://modular-infrastructure.onrender.com${escapeHtml(system.logo)}"
                  style="
                  width:90px;
                  height:90px;
                  object-fit:cover;
                  border-radius:18px;
                  border:2px solid rgba(255,255,255,0.1);
                  "
                  />
                </div>
                ` : ""}

                <div style="
                  display:flex;
                  gap:12px;
                  flex-wrap:wrap;
                ">

                  <a
                  href="/admin/setups/${system.id}/configure"
                  style="
                  background:#10b981;
                  color:white;
                  text-decoration:none;
                  padding:12px 18px;
                  border-radius:12px;
                  font-weight:bold;
                  ">
                    Configure
                  </a>

                  <button style="
                  background:#334155;
                  color:white;
                  border:none;
                  padding:12px 18px;
                  border-radius:12px;
                  cursor:pointer;
                  ">
                    View Details
                  </button>

                </div>

              </div>

            </div>
          `;
        }).join("")

        : `
        <div class="card">
          <h3>No systems found.</h3>
        </div>
        `;

      const content = `
        <h2 style="
          margin-bottom:20px;
        ">
          Systems Management
        </h2>

        <div style="
          display:grid;
          grid-template-columns:
          repeat(auto-fit,
          minmax(340px,1fr));
          gap:22px;
        ">
          ${systemCards}
        </div>
      `;

      res.send(
        renderPage(
          "Systems",
          content
        )
      );

    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  });

  return router;
}

module.exports = adminSystems;
