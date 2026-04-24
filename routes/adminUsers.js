const express = require("express");

function adminUsers(pool, renderPage) {
  const router = express.Router();

  /* =========================
     Admin Users
  ========================= */

  router.get("/admin-users", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, username, password, role, created_at
        FROM admin_users
        ORDER BY created_at DESC
      `);

      let rows = result.rows.map(r => `
        <tr>
          <td>${r.id}</td>
          <td>${r.username}</td>
          <td>${r.password}</td>
          <td>${r.role || "N/A"}</td>
          <td>${r.created_at}</td>
        </tr>
      `).join("");

      const content = `
        <table>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Password</th>
            <th>Role</th>
            <th>Created At</th>
          </tr>
          ${rows}
        </table>
      `;

      res.send(renderPage("Admin Users", content));

    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminUsers;