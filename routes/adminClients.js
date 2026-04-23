const express = require("express");

function adminClients(pool, renderPage) {
  const router = express.Router();

  // GET clients (VIEW ONLY)
  router.get("/clients", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM clients");

      let rows = result.rows.map(c => `
        <tr>
          <td>${c.id}</td>
          <td>${c.name}</td>
          <td>${c.email}</td>
          <td>${c.status}</td>
        </tr>
      `).join("");

      const content = `
        <div style="margin-bottom:20px;">
          <h3>Clients Overview</h3>
          <p style="color:gray;">
            Clients are registered through the system and displayed here automatically.
          </p>
        </div>

        <table>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
          ${rows}
        </table>
      `;

      res.send(renderPage("Clients", content));

    } catch (err) {
      console.error(err);
      res.send("Error loading clients");
    }
  });

  return router;
}

module.exports = adminClients;