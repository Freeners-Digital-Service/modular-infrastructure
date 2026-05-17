const express = require("express");

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function adminConfigure(pool, renderPage) {
  const router = express.Router();

  router.get("/setups/:id/configure", async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `SELECT * FROM setups WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).send("Setup not found");
      }

      const setup = result.rows[0];

      const content = `
        <div style="background:#fff; padding:24px; border-radius:18px; box-shadow:0 10px 30px rgba(0,0,0,0.06); max-width:800px;">
          <h2 style="margin-bottom:16px;">Configure Setup</h2>

          <p><strong>Type:</strong> ${escapeHtml(setup.item_type || "-")}</p>
          <p><strong>Business Name:</strong> ${escapeHtml(setup.business_name || "-")}</p>
          <p><strong>Email:</strong> ${escapeHtml(setup.business_email || "-")}</p>
          <p><strong>Status:</strong> ${escapeHtml(setup.status || "-")}</p>

          <form method="POST" action="/admin/setups/${setup.id}/configure" style="margin-top:20px;">
            <button type="submit" style="
              background:#16a34a;
              color:#fff;
              border:0;
              padding:12px 18px;
              border-radius:12px;
              font-weight:700;
              cursor:pointer;
            ">
              Activate
            </button>
          </form>
        </div>
      `;

      res.send(renderPage("Configure Setup", content));
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  });

  router.post("/setups/:id/configure", async (req, res) => {
    try {
      const { id } = req.params;

      await pool.query(
        `UPDATE setups
         SET status = 'active'
         WHERE id = $1`,
        [id]
      );

      return res.redirect("/admin");
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  });

  return router;
}

module.exports = adminConfigure;