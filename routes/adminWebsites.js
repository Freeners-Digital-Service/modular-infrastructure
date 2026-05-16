const express = require("express");

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function adminWebsites(pool, renderPage) {
  const router = express.Router();

  router.get("/websites", async (req, res) => {
    try {

      const websites = await pool.query(`
        SELECT *
        FROM setups
        WHERE item_type = 'website'
        ORDER BY id DESC
      `);

      const websiteCards = websites.rows.length
        ? websites.rows.map((site) => {

            const status = site.status || "under_configuration";

            const statusColor =
              status === "active"
                ? "#16a34a"
                : "#f97316";

            const viewLink = site.domain
              ? `https://${site.domain}`
              : "#";

            return `
              <details
              onclick="
              document.querySelectorAll('details')
              .forEach(el => {
              if(el !== this){
              el.removeAttribute('open');
              }
              });
              "
              style="
              background:#fff;
              border-radius:18px;
              box-shadow:0 10px 25px rgba(0,0,0,0.08);
              overflow:hidden;
              ">

                <summary style="
                padding:20px;
                cursor:pointer;
                display:flex;
                justify-content:space-between;
                align-items:center;
                font-weight:bold;
                list-style:none;
                ">

                  <span>
                    WEBSITE
                  </span>

                  <span style="
                  background:${statusColor};
                  color:white;
                  padding:6px 12px;
                  border-radius:999px;
                  font-size:12px;
                  ">
                    ${escapeHtml(status)}
                  </span>

                </summary>

                <div style="
                padding:20px;
                border-top:1px solid #eee;
                ">

                  <p>
                    <strong>Website ID:</strong>
                    ${escapeHtml(site.website_id || "-")}
                  </p>

                  <p>
                    <strong>Business Name:</strong>
                    ${escapeHtml(site.business_name || "-")}
                  </p>

                  <p>
                    <strong>Email:</strong>
                    ${escapeHtml(site.business_email || "-")}
                  </p>

                  <p>
                    <strong>Phone:</strong>
                    ${escapeHtml(site.phone || "-")}
                  </p>

                  <p>
                    <strong>Domain:</strong>
                    ${escapeHtml(site.domain || "-")}
                  </p>

                  <p>
                    <strong>Brand Color:</strong>
                    ${escapeHtml(site.brand_color || "-")}
                  </p>

                  ${site.logo ? `
                  <p>
                  <strong>Logo:</strong><br>
                  <img
                  src="https://modular-infrastructure.onrender.com${escapeHtml(site.logo)}"
                  style="
                  max-width:120px;
                  margin-top:10px;
                  border-radius:10px;
                  "
                  />
                  </p>
                  ` : ""}

                  <div style="
                  display:flex;
                  gap:10px;
                  margin-top:16px;
                  flex-wrap:wrap;
                  ">

                    <a
                    href="/admin/setups/${site.id}/configure"
                    class="btn btn-primary">
                      Configure
                    </a>

                    <a
                    href="${escapeHtml(viewLink)}"
                    target="_blank"
                    class="btn btn-secondary">
                      View
                    </a>

                  </div>

                </div>
              </details>
            `;
          }).join("")
        : `<p>No websites found.</p>`;

      const content = `
        <h2 style="margin-bottom:20px;">
          Websites
        </h2>

        <div style="
        display:grid;
        grid-template-columns:
        repeat(3,minmax(0,1fr));
        gap:20px;
        ">
          ${websiteCards}
        </div>
      `;

      res.send(
        renderPage(
          "Websites",
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

module.exports = adminWebsites;