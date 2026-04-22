function renderPage(title, content) {
  return `
    <html>
    <head>
      <title>${title}</title>
      <style>
        body {
          margin: 0;
          font-family: Arial;
          display: flex;
        }

        .sidebar {
          width: 220px;
          background: #111;
          color: white;
          height: 100vh;
          padding: 20px;
        }

        .sidebar h2 {
          margin-bottom: 20px;
        }

        .sidebar a {
          display: block;
          color: white;
          text-decoration: none;
          margin: 10px 0;
        }

        .main {
          flex: 1;
          padding: 20px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          border: 1px solid #ccc;
          padding: 10px;
        }
      </style>
    </head>

    <body>

      <div class="sidebar">
        <h2>Admin</h2>
        <a href="/admin">Dashboard</a>
        <a href="/admin/clients">Clients</a>
        <a href="/admin/systems">Systems</a>
        <a href="/admin/modules">Modules</a>
        <a href="/admin/agents">Agents</a>
      </div>

      <div class="main">
        <h1>${title}</h1>
        ${content}
      </div>

    </body>
    </html>
  `;
}
module.exports = renderPage;