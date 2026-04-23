const express = require("express");

function adminClients(pool, renderPage) {
  const router = express.Router();

  // GET clients
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
        <h3>Add New Client</h3>

        <form method="POST" action="/admin/clients">
          <input name="name" placeholder="Name" required />
          <input name="email" placeholder="Email" required />
          <input name="status" value="active" />
          <button>Create</button>
        </form>

        <br/>

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
      res.send(err.message);
    }
  });

  // POST create client
  router.post("/clients", async (req, res) => {
    try {
      const { name, email, status } = req.body;

      await pool.query(
        "INSERT INTO clients (name, email, status) VALUES ($1, $2, $3)",
        [name, email, status]
      );

      res.redirect("/admin/clients");

    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  });

  return router;
}

module.exports = adminClients;