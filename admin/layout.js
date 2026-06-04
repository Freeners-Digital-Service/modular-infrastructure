function renderPage(title, content) {
  return `
  <html>
  <head>
    <title>${title}</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    <style>

      *{
        margin:0;
        padding:0;
        box-sizing:border-box;
      }

      body{
        font-family: Arial, sans-serif;
        background:#f4f7fb;
        display:flex;
        min-height:100vh;
        color:#111827;
      }

      /* =========================
         SIDEBAR
      ========================= */

      .sidebar{
        width:260px;
        background:linear-gradient(
          180deg,
          #111827,
          #1f2937
        );
        color:white;
        min-height:100vh;
        height:fit-content;
        padding:24px 18px;
        position:sticky;
        top:0;
        box-shadow:4px 0 20px rgba(0,0,0,0.1);
      }

      .brand{
        font-size:26px;
        font-weight:700;
        margin-bottom:30px;
        color:#10b981;
      }

      .menu-title{
        color:#9ca3af;
        font-size:12px;
        margin-bottom:12px;
        text-transform:uppercase;
        letter-spacing:1px;
      }

      .sidebar a{
        display:flex;
        align-items:center;
        gap:10px;
        color:#e5e7eb;
        text-decoration:none;
        padding:14px 16px;
        border-radius:12px;
        margin-bottom:10px;
        transition:all .3s ease;
        font-size:15px;
        font-weight:500;
      }

      .sidebar a:hover{
        background:#10b981;
        color:white;
        transform:translateX(4px);
      }

      .accordion-btn{
        width:100%;
        border:none;
        background:transparent;
        color:#e5e7eb;
        text-align:left;
        padding:14px 16px;
        border-radius:12px;
        cursor:pointer;
        font-size:15px;
        font-weight:500;
        margin-bottom:10px;
      }

      .accordion-btn:hover{
        background:#10b981;
        color:white;
      }

      .accordion-content{
        display:none;
        padding-left:12px;
        background:#1f2937;
        border-radius:12px;
        margin-bottom:10px;
      }

      /* =========================
         MAIN
      ========================= */

      .main{
        flex:1;
        padding:35px;
        overflow-x:auto;
      }

      .page-header{
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:30px;
      }

      .page-header h1{
        font-size:34px;
        color:#111827;
      }

      /* =========================
         DASHBOARD CARDS
      ========================= */

      .stats-grid{
        display:grid;
        grid-template-columns:
        repeat(auto-fit, minmax(220px,1fr));
        gap:20px;
        margin-bottom:35px;
      }

      .card{
        background:white;
        padding:24px;
        border-radius:20px;
        box-shadow:
        0 10px 30px rgba(0,0,0,0.06);
        transition:all .3s ease;
      }

      .card:hover{
        transform:translateY(-4px);
      }

      .card h2{
        font-size:16px;
        color:#6b7280;
        margin-bottom:12px;
      }

      .card p{
        font-size:32px;
        font-weight:bold;
        color:#111827;
      }

      /* =========================
         TABLE
      ========================= */

      table{
        width:100%;
        border-collapse:collapse;
        background:white;
        border-radius:18px;
        overflow:hidden;
        box-shadow:
        0 10px 30px rgba(0,0,0,0.05);
      }

      th{
        background:#111827;
        color:white;
        padding:16px;
        text-align:left;
      }

      td{
        padding:16px;
        border-bottom:1px solid #e5e7eb;
      }

      tr:hover{
        background:#f9fafb;
      }

      /* =========================
         BUTTONS
      ========================= */

      .btn{
        display:inline-block;
        padding:10px 18px;
        border-radius:10px;
        text-decoration:none;
        font-size:14px;
        font-weight:600;
        transition:.3s ease;
      }

      .btn-primary{
        background:#10b981;
        color:white;
      }

      .btn-primary:hover{
        background:#059669;
      }

      .btn-secondary{
        background:#3b82f6;
        color:white;
      }

      .btn-secondary:hover{
        background:#2563eb;
      }

      /* =========================
         MOBILE
      ========================= */

      @media(max-width:900px){

        body{
          flex-direction:column;
        }

        .sidebar{
          width:100%;
          min-height:auto;
          position:relative;
        }

        .main{
          padding:20px;
        }

      }

    </style>
  </head>

  <body>

    <div class="sidebar">

  <div class="brand">
    Freener OS
  </div>

  <div class="menu-title">
    Navigation
  </div>

  <a href="/admin">
    Dashboard
  </a>

  <a href="/admin/clients">
    Clients
  </a>

  <a href="/admin/systems">
    Systems
  </a>

  <a href="/admin/websites">
    Websites
  </a>

  <a href="/admin/modules">
    Modules
  </a>

  <a href="/admin/agents">
    Agents
  </a>

  <button class="accordion-btn">
    Agent Automation
  </button>

  <div class="accordion-content">

    <a href="/admin/client-agents">
      Client Agents
    </a>

    <a href="/admin/agent-capabilities">
      Agent Capabilities
    </a>

    <a href="/admin/agent-tasks">
      Agent Tasks
    </a>

    <a href="/admin/agent-task-assignments">
      Task Assignments
    </a>

    <a href="/admin/agent-task-logs">
      Task Logs
    </a>

  </div>

  <button class="accordion-btn">
    Billing & Operations
  </button>

  <div class="accordion-content">

    <a href="/admin/invoices">
      Invoices
    </a>

    <a href="/admin/payments">
      Payments
    </a>

    <a href="/admin/transactions">
      Transactions
    </a>

    <a href="/admin/subscriptions">
      Subscriptions
    </a>

    <a href="/admin/recurring-billing">
      Recurring Billing
    </a>

    <a href="/admin/receipts">
      Receipts
    </a>

    <a href="/admin/billing-logs">
      Billing Logs
    </a>

  </div>

</div>

    <div class="main">

      <div class="page-header">
        <h1>${title}</h1>
      </div>

      ${content}

    </div>

    <script>
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll(".accordion-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const content = btn.nextElementSibling;
          content.style.display =
            content.style.display === "block" ? "none" : "block";
        });
      });
    });
    </script>

  </body>
  </html>
  `;
}

module.exports = renderPage;
