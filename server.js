process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("🔥 Unhandled Rejection:", err);
});

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
const products = require("./products/products");
const path = require("path");
const multer = require("multer");
const adminClients = require("./routes/adminClients");
const renderPage = require("./admin/layout");
const authRoutes = require("./routes/auth");



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });


const app = express();
const PORT = process.env.PORT || 3000;

const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use("/uploads", express.static("uploads"));
app.use("/admin", adminClients(pool, renderPage));
app.use("/auth", authRoutes(pool));



/* =========================
   POSTGRES MEMORY
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS memory (
        id SERIAL PRIMARY KEY,
        username TEXT,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Memory table ready");
  } catch (err) {
    console.error("Memory table error:", err);
  }
})();

async function saveMemory(user, message) {
  await pool.query(
    "INSERT INTO memory (username, message) VALUES ($1, $2)",
    [user, message]
  );
}

async function getMemory(user) {
  const result = await pool.query(
    "SELECT message FROM memory WHERE username = $1 ORDER BY id DESC LIMIT 5",
    [user]
  );

  return result.rows;
}

/* =========================
   USERS TABLE
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Users table ready");
  } catch (err) {
    console.error("Users table error:", err);
  }
})();

/* =========================
   AGENTS TABLE
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS agents (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE,
        description TEXT,
        system_prompt TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Agents table ready");

  } catch (err) {

    console.error("Agents table error:", err);

  }
})();

/* =========================
   TOOLS TABLE
========================= */

(async () => {
  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tools (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE,
        description TEXT,
        type TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Tools table ready");

  } catch (err) {

    console.error("Tools table error:", err);

  }
})();

/* =========================
   TOOL ENGINE
========================= */

async function loadTool(toolName) {

  const result = await pool.query(
    "SELECT * FROM tools WHERE name = $1",
    [toolName]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];

}



/* =========================
   AGENTS  TABLE
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS agents (
        id SERIAL PRIMARY KEY,
        module_id INTEGER,
        name TEXT,
        status TEXT DEFAULT 'stopped',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Agents table ready");
  } catch (err) {
    console.error("Agents table error:", err);
  }
})();


/* =========================
   AGENT SESSIONS TABLE
========================= */

(async () => {
  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS agent_sessions (
        id SERIAL PRIMARY KEY,
        username TEXT,
        agent TEXT,
        status TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Agent sessions table ready");

  } catch (err) {

    console.error("Agent sessions table error:", err);

  }
})();

/* =========================
   AGENT RUNTIME ENGINE
========================= */

async function startAgentSession(user, agent) {

  const result = await pool.query(
    "INSERT INTO agent_sessions (username, agent, status) VALUES ($1, $2, $3) RETURNING id",
    [user, agent, "running"]
  );

  return result.rows[0].id;

}

async function finishAgentSession(sessionId) {

  await pool.query(
    "UPDATE agent_sessions SET status = $1 WHERE id = $2",
    ["completed", sessionId]
  );

}

/* =========================
   AGENT TASKS TABLE
========================= */

(async () => {
  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS agent_tasks (
        id SERIAL PRIMARY KEY,
        session_id INTEGER,
        task TEXT,
        status TEXT,
        result TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Agent tasks table ready");

  } catch (err) {

    console.error("Agent tasks table error:", err);

  }
})();

/* =========================
   AGENT TASK ENGINE
========================= */

async function createTask(sessionId, task) {

  const result = await pool.query(
    "INSERT INTO agent_tasks (session_id, task, status) VALUES ($1, $2, $3) RETURNING id",
    [sessionId, task, "pending"]
  );

  return result.rows[0].id;

}

async function completeTask(taskId, resultText) {

  await pool.query(
    "UPDATE agent_tasks SET status = $1, result = $2 WHERE id = $3",
    ["completed", resultText, taskId]
  );

}

/* =========================
   MARKETPLACE PRODUCTS TABLE
========================= */

(async () => {
  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS marketplace_products (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE,
        description TEXT,
        agent TEXT,
        price NUMERIC,
        billing_type TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Marketplace products table ready");

  } catch (err) {

    console.error("Marketplace products table error:", err);

  }
})();



/* =========================
   MARKETPLACE ENGINE
========================= */

async function getMarketplaceProducts() {

  const result = await pool.query(
    "SELECT * FROM marketplace_products ORDER BY id DESC"
  );

  return result.rows;

}

/* =========================
   SUBSCRIPTIONS TABLE
========================= */

(async () => {
  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        username TEXT,
        product_id INTEGER,
        start_date TIMESTAMP,
        next_billing_date TIMESTAMP,
        monthly_price NUMERIC,
        status TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Subscriptions table ready");

  } catch (err) {

    console.error("Subscriptions table error:", err);

  }
})();

/* =========================
   SUBSCRIPTION FEATURES TABLE
========================= */

(async () => {
  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscription_features (
        id SERIAL PRIMARY KEY,
        subscription_id INTEGER,
        feature_name TEXT,
        price NUMERIC,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Subscription features table ready");

  } catch (err) {

    console.error("Subscription features table error:", err);

  }
})();


/* =========================
   INVOICES TABLE
========================= */

(async () => {
  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        subscription_id INTEGER,
        amount NUMERIC,
        status TEXT,
        payment_reference TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Invoices table ready");

  } catch (err) {

    console.error("Invoices table error:", err);

  }
})();


/*=================== 
  PURCHASES TABLE
================== */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS purchases (
        id SERIAL PRIMARY KEY,
        username TEXT,
        product_id INTEGER,
        transaction_id TEXT,
        amount NUMERIC,
        status TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Purchases table ready");

  } catch (err) {
    console.error("Purchases table error:", err);
  }
})();


/* =========================
   SETUP TABLE
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS setups (
        id SERIAL PRIMARY KEY,
        product_id INTEGER,
        email TEXT,
        password TEXT,
        data JSONB,
        logo TEXT,
        step INTEGER DEFAULT 1,
        status TEXT DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(product_id, email)
      );
    `);

    console.log("Setup table ready");

  } catch (err) {
    console.error("Setup table error:", err);
  }
})();



 /*==============
    Clients table
  ============== */ 
  (async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Clients table ready");
  } catch (err) {
    console.error("Clients table error:", err);
  }
})(); 



 /*============
  SYSTEMS TABLE
  ============*/ 
  (async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS systems (
        id SERIAL PRIMARY KEY,
        client_id INTEGER,
        name TEXT,
        type TEXT,
        status TEXT DEFAULT 'stopped',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Systems table ready");
  } catch (err) {
    console.error("Systems table error:", err);
  }
})();


/*================
   modules tsble
   =============*/
   (async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS modules (
        id SERIAL PRIMARY KEY,
        system_id INTEGER,
        name TEXT,
        status TEXT DEFAULT 'inactive',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Modules table ready");
  } catch (err) {
    console.error("Modules table error:", err);
  }
})();



/* =========================
    BILLING TABLE
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS billing (
        id SERIAL PRIMARY KEY,
        client_id INTEGER,
        system_id INTEGER,
        amount NUMERIC,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Billing table ready");
  } catch (err) {
    console.error("Billing table error:", err);
  }
})();

/* =========================
   PRICING TABLE
========================= */
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pricing (
        id SERIAL PRIMARY KEY,
        system_id INTEGER,
        module_id INTEGER,
        price NUMERIC,
        billing_cycle TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Pricing table ready");
  } catch (err) {
    console.error("Pricing table error:", err);
  }
})();



/* =========================
    USAGE TABLE
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usage (
        id SERIAL PRIMARY KEY,
        client_id INTEGER,
        system_id INTEGER,
        module_id INTEGER,
        agent_id INTEGER,
        usage_type TEXT,
        amount NUMERIC,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Usage table ready");
  } catch (err) {
    console.error("Usage table error:", err);
  }
})();


/* =========================
     ENGINES TABLE
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS engines (
        id SERIAL PRIMARY KEY,
        name TEXT,
        type TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Engines table ready");
  } catch (err) {
    console.error("Engines table error:", err);
  }
})();


/* =========================
    ADMIN USERS TABLE
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username TEXT,
        password TEXT,
        role TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Admin users table ready");
  } catch (err) {
    console.error("Admin users table error:", err);
  }
})();


/* =========================
    ACTIVITY LOGS TABLE
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER,
        action TEXT,
        target TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Activity logs table ready");
  } catch (err) {
    console.error("Activity logs table error:", err);
  }
})();



/* =========================
    SYSTEM LOGS TABLE
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_logs (
        id SERIAL PRIMARY KEY,
        system_id INTEGER,
        level TEXT,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("System logs table ready");
  } catch (err) {
    console.error("System logs table error:", err);
  }
})();


/* =========================
    ALERTS TABLE
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        system_id INTEGER,
        type TEXT,
        message TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Alerts table ready");
  } catch (err) {
    console.error("Alerts table error:", err);
  }
})();


/* =========================
    ANALYTICS EVENTS Table
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        client_id INTEGER,
        system_id INTEGER,
        event_type TEXT,
        metadata TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Analytics events table ready");
  } catch (err) {
    console.error("Analytics events error:", err);
  }
})();


/* =========================
    SYSTEM HEALTH TABLE
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_health (
        id SERIAL PRIMARY KEY,
        system_id INTEGER,
        cpu_usage NUMERIC,
        memory_usage NUMERIC,
        status TEXT,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("System health table ready");
  } catch (err) {
    console.error("System health table error:", err);
  }
})();


/* =========================
    DEPLOYMENTS TABLE
========================= */
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS deployments (
        id SERIAL PRIMARY KEY,
        system_id INTEGER,
        version TEXT,
        status TEXT,
        deployed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Deployments table ready");
  } catch (err) {
    console.error("Deployments table error:", err);
  }
})();

/* =========================
   PERMISSIONS TABLE
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER,
        resource TEXT,
        action TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Permissions table ready");
  } catch (err) {
    console.error("Permissions table error:", err);
  }
})();

/*==============
EMBEDDING TABLE
==============*/

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS embeddings (
        id SERIAL PRIMARY KEY,
        system_id INTEGER,
        content TEXT,
        vector TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Embeddings table ready");
  } catch (err) {
    console.error("Embeddings table error:", err);
  }
})();



/* =========================
    SOCIAL MEDIA TABLE
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS social_media (
        id SERIAL PRIMARY KEY,
        client_id INTEGER,
        platform TEXT,
        account_name TEXT,
        status TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Social media table ready");
  } catch (err) {
    console.error("Social media table error:", err);
  }
})();


/* =========================
CONNECT SYSTEMS TO CLIENTS Tables
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS client_systems (
        id SERIAL PRIMARY KEY,
        client_id INTEGER,
        system_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Client systems table ready");
  } catch (err) {
    console.error("Client systems table error:", err);
  }
})();


/* =========================
   TABLE: system_modules
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_modules (
        id SERIAL PRIMARY KEY,
        system_id INTEGER,
        module_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("System modules table ready");
  } catch (err) {
    console.error("System modules table error:", err);
  }
})();


/* =========================
   TABLE: module_agents
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS module_agents (
        id SERIAL PRIMARY KEY,
        module_id INTEGER,
        agent_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Module agents table ready");
  } catch (err) {
    console.error("Module agents table error:", err);
  }
})();


/* =========================
    SECURITY TABLE
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS security (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER,
        action TEXT,
        ip_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Security table ready");
  } catch (err) {
    console.error("Security table error:", err);
  }
})();


/* =========================
   SUPPORT TABLE
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS support (
        id SERIAL PRIMARY KEY,
        client_id INTEGER,
        subject TEXT,
        message TEXT,
        status TEXT DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Support table ready");
  } catch (err) {
    console.error("Support table error:", err);
  }
})();


/* =========================
   SETTINGS TABLE
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key TEXT,
        value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Settings table ready");
  } catch (err) {
    console.error("Settings table error:", err);
  }
})();



/* =========================
   MONITORING TABLE
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS monitoring (
        id SERIAL PRIMARY KEY,
        system_id INTEGER,
        status TEXT,
        uptime NUMERIC,
        checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Monitoring table ready");
  } catch (err) {
    console.error("Monitoring table error:", err);
  }
})();




/* =========================
   AUTH LOGIN
========================= */

app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "User not found"
      });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid password"
      });
    }

    const token = jwt.sign(
      { user: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({
      error: "Login failed"
    });
  }
});




/* =========================
   AUTH REGISTER
========================= */

app.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [username, hashedPassword]
    );

    res.json({
      message: "User registered successfully"
    });

  } catch (error) {
    res.status(500).json({
      error: "Registration failed"
    });
  }
});

/* =========================
   JWT VERIFY MIDDLEWARE
========================= */

function verifyToken(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({
      error: "Token required"
    });
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded.user;

    next();

  } catch (error) {

    return res.status(401).json({
      error: "Invalid token"
    });

  }

}

/* =========================
   ROOT
========================= */

app.get("/", (req, res) => {
  res.json({
    status: "Modular Infrastructure Running",
    author: "Freener Awhaefe",
    version: "1.0.0"
  });
});

/* =========================
   HEALTH
========================= */

app.get("/health", (req, res) => {
  res.json({
    uptime: process.uptime(),
    message: "System healthy",
    timestamp: new Date()
  });
});

/* =========================
   PLATFORM SERVICES
========================= */

app.get("/api/chatbots", (req, res) => {
  res.json({ service: "AI Chatbots", status: "Operational" });
});

app.get("/api/crm", (req, res) => {
  res.json({ service: "CRM Systems", status: "Operational" });
});

app.get("/api/cloud", (req, res) => {
  res.json({ service: "Cloud Infrastructure", status: "Operational" });
});

app.get("/api/automation", (req, res) => {
  res.json({ service: "Automation", status: "Operational" });
});

app.get("/api/webapps", (req, res) => {
  res.json({ service: "Web Apps", status: "Operational" });
});


/* =========================
   MARKETPLACE PRODUCTS (FILE-BASED)
========================= */


// ✅ GET ALL PRODUCTS
app.get("/api/marketplace/products", (req, res) => {
  try {
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Marketplace fetch failed"
    });
  }
});


// ❌ CREATE PRODUCT (DISABLED — now managed via file)
// (We don't insert products into DB anymore)

app.post("/api/create-product", (req, res) => {
  res.status(400).json({
    error: "Product creation disabled. Use products.js file instead."
  });
});


/* =========================
   CHECKOUT ENGINE
========================= */

app.get("/api/checkout/:product_id", async (req, res) => {

  try {

    const productId = req.params.product_id;

    const result = await pool.query(
      "SELECT * FROM marketplace_products WHERE id = $1",
      [productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    const product = result.rows[0];

    const oneTime = product.one_time_price || 0;
    const monthly = product.monthly_price || 0;

    const firstPayment = oneTime + monthly;

    res.json({
      product: product.name,
      type: product.type,
      one_time_price: oneTime,
      monthly_price: monthly,
      first_payment: firstPayment,
      billing_cycle: "monthly"
    });

  } catch (error) {

    res.status(500).json({
      error: "Checkout calculation failed"
    });

  }

});


/* =========================
   PAYMENT ENGINE (FLUTTERWAVE)
========================= */

app.post("/api/pay", async (req, res) => {
  try {
    const { product_id } = req.body;

    // ✅ Get product from products.js
    const product = products.find(p => p.id == product_id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // ✅ Generate tx_ref (includes product_id)
    const tx_ref = "freener_" + product_id + "_" + Date.now();

    // ✅ Calculate total (setup + first month)
    const amount =
      product.pricing.setup_fee + product.pricing.monthly;

    const response = await fetch(
      "https://api.flutterwave.com/v3/payments",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tx_ref: tx_ref,
          amount: amount,
          currency: "USD",
          redirect_url:
            "https://freeners-ui-site.netlify.app/payment-success.html",

          customer: {
            email: "test@email.com",
            name: "Test User"
          },

          customizations: {
            title: product.name,
            description: product.description
          }
        })
      }
    );

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Payment initialization failed"
    });
  }
});


app.get("/api/verify-payment", async (req, res) => {
  try {
    const { transaction_id } = req.query;

    if (!transaction_id) {
      return res.status(400).json({ error: "Missing transaction_id" });
    }

    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
        }
      }
    );

    const data = await response.json();

    if (data.status === "success" && data.data.status === "successful") {
      return res.json({
        success: true,
        data: data.data
      });
    } else {
      return res.json({
        success: false
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false
    });
  }
});



app.get("/payment-success", (req, res) => {
  res.send(`
    <h2>Verifying payment...</h2>

    <script>
      const params = new URLSearchParams(window.location.search);

      const transaction_id = params.get("transaction_id");
      const tx_ref = params.get("tx_ref");
      const status = params.get("status");

      let product_id = "";
      if (tx_ref) {
        const parts = tx_ref.split("_");
        product_id = parts[1] || "";
      }

      async function processPayment() {

        // ✅ CASE 1: status only (no verification available)
        if (status === "success" && !transaction_id) {
          document.body.innerHTML =
            "<div style='text-align:center;margin-top:50px'>" +
            "<h2>✅ Payment Successful</h2>" +
            "<p>Your system is ready to configure</p>" +
            "<br><br>" +
            "<button onclick=\\"window.location.href='https://freeners-ui-site.netlify.app/setup.html?id=" + product_id + "'\\">Proceed to Setup</button>" +
            "</div>";
          return;
        }

        // ❌ Missing everything
        if (!transaction_id) {
          document.body.innerHTML =
            "<div style='text-align:center;margin-top:50px'>" +
            "<h2>❌ Payment Failed</h2>" +
            "<p>Please try again or contact support</p>" +
            "</div>";
          return;
        }

        try {

          // 🔍 VERIFY PAYMENT
          const verifyRes = await fetch("/api/verify-payment?transaction_id=" + transaction_id);
          const verifyData = await verifyRes.json();

          if (!verifyData.success) {
            document.body.innerHTML =
              "<div style='text-align:center;margin-top:50px'>" +
              "<h2>❌ Payment Failed</h2>" +
              "<p>Please try again or contact support</p>" +
              "</div>";
            return;
          }

          // 💾 SAVE PURCHASE
          await fetch("/api/purchase", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              transaction_id: transaction_id,
              product_id: product_id,
              email: "test@email.com"
            })
          });

          // ✅ SUCCESS UI
          document.body.innerHTML =
            "<div style='text-align:center;margin-top:50px'>" +
            "<h2>✅ Payment Successful</h2>" +
            "<p>Your system is ready to configure</p>" +
            "<br><br>" +
            "<button onclick=\\"window.location.href='https://freeners-ui-site.netlify.app/setup.html?id=" + product_id + "'\\">Proceed to Setup</button>" +
            "</div>";

        } catch (err) {

          // ⚠️ SAFE ERROR (NO FAKE SUCCESS)
          document.body.innerHTML =
            "<div style='text-align:center;margin-top:50px'>" +
            "<h2>⚠️ Verification Pending</h2>" +
            "<p>We couldn't confirm your payment right now.</p>" +
            "<p>Please wait a moment and try again.</p>" +
            "<br><br>" +
            "<button onclick='location.reload()'>Retry</button>" +
            "</div>";

        }

      }

      processPayment();
    </script>
  `);
});



/*===========
  API ROUTE
  ========= */

app.post("/api/purchase", async (req, res) => {
  try {
    const { transaction_id, product_id } = req.body;

    // 🚫 STOP if no transaction_id
    if (!transaction_id) {
      return res.status(400).json({
        error: "Missing transaction_id"
      });
    }

    // ✅ YOUR SYSTEM (USERNAME BASED)
    const username = "test_user";

    // 🔒 VERIFY PAYMENT (Flutterwave)
    const verifyRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
        }
      }
    );

    const verifyData = await verifyRes.json();

    if (
      verifyData.status !== "success" ||
      verifyData.data.status !== "successful"
    ) {
      return res.status(400).json({
        error: "Payment not verified"
      });
    }

    const amount = verifyData.data.amount;

    // 💾 SAVE PURCHASE (USERNAME)
    await pool.query(
      `INSERT INTO purchases 
      (username, product_id, transaction_id, amount, status)
      VALUES ($1, $2, $3, $4, $5)`,
      [username, product_id, transaction_id, amount, "active"]
    );

    res.json({
      success: true,
      message: "Purchase saved successfully"
    });

  } catch (error) {
    console.error("Purchase error:", error);

    res.status(500).json({
      error: "Purchase saving failed"
    });
  }
});

    /*========
     API USER
     ======== */

app.get("/api/user/purchases", async (req, res) => {
  try {
    // ✅ TEMP USER (same as purchase API)
    const username = "test_user";

    const result = await pool.query(
      "SELECT * FROM purchases WHERE username = $1 ORDER BY id DESC",
      [username]
    );

    res.json(result.rows);

  } catch (error) {
    console.error("Fetch purchases error:", error);

    res.status(500).json({
      error: "Failed to fetch purchases"
    });
  }
});



/* =========================
   SAVE SETUP (AUTO SAVE)
========================= */

app.post("/api/setup/save", async (req, res) => {
  try {
    const {
      product_id,
      system_name,
      business_name,
      domain,
      admin_email,
      primary_color,
      secondary_color,
      step
    } = req.body;

    const username = "test_user";

    const existing = await pool.query(
      "SELECT * FROM setups WHERE product_id = $1 AND username = $2",
      [product_id, username]
    );

    if (existing.rows.length > 0) {

      await pool.query(
        `UPDATE setups SET
          system_name = $1,
          business_name = $2,
          domain = $3,
          admin_email = $4,
          primary_color = $5,
          secondary_color = $6,
          step = $7
         WHERE product_id = $8 AND username = $9`,
        [
          system_name,
          business_name,
          domain,
          admin_email,
          primary_color,
          secondary_color,
          step,
          product_id,
          username
        ]
      );

    } else {

      await pool.query(
        `INSERT INTO setups
        (product_id, username, system_name, business_name, domain, admin_email, primary_color, secondary_color, step)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          product_id,
          username,
          system_name,
          business_name,
          domain,
          admin_email,
          primary_color,
          secondary_color,
          step
        ]
      );

    }

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Save failed" });
  }
});


/* =========================
   LOAD SETUP
========================= */

app.get("/api/setup/load", async (req, res) => {
  try {
    const { product_id } = req.query;

    const username = "test_user";

    const result = await pool.query(
      "SELECT * FROM setups WHERE product_id = $1 AND username = $2",
      [product_id, username]
    );

    if (result.rows.length === 0) {
      return res.json({ found: false });
    }

    const setup = result.rows[0];

    res.json({
      found: true,
      step: setup.step,
      status: setup.status,

      // ✅ RETURN REAL STRUCTURED DATA
      system_name: setup.system_name,
      business_name: setup.business_name,
      domain: setup.domain,
      admin_email: setup.admin_email,
      primary_color: setup.primary_color,
      secondary_color: setup.secondary_color,
      logo: setup.logo
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Load failed" });
  }
});

  /*=========
   Load All setup
  ===========*/

app.get("/api/setup/load-all", async (req, res) => {
  try {
    const username = req.query.username || "test_user";

    const result = await pool.query(
      "SELECT * FROM setups WHERE username = $1 ORDER BY id DESC",
      [username]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load systems" });
  }
});



/* =========================
   SUBMIT SETUP
========================= */

app.post("/api/setup/submit", upload.single("logo_file"), async (req, res) => {
  try {
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    const username = "test_user";

    const logoPath = req.file ? `/uploads/${req.file.filename}` : null;

    const {
      product_id,
      system_name,
      business_name,
      domain,
      admin_email,
      primary_color,
      secondary_color
    } = req.body;

    // 🔹 CHECK IF SETUP EXISTS
    const existing = await pool.query(
      "SELECT * FROM setups WHERE product_id = $1 AND username = $2",
      [product_id, username]
    );

    if (existing.rows.length > 0) {

      // 🔹 UPDATE (DO NOT LOSE OLD LOGO)
      const currentLogo = existing.rows[0].logo;

      await pool.query(
        `UPDATE setups SET
          system_name = $1,
          business_name = $2,
          domain = $3,
          admin_email = $4,
          primary_color = $5,
          secondary_color = $6,
          logo = $7,
          status = 'submitted',
          step = 999
        WHERE product_id = $8 AND username = $9`,
        [
          system_name,
          business_name,
          domain,
          admin_email,
          primary_color,
          secondary_color,
          logoPath || currentLogo,
          product_id,
          username
        ]
      );

    } else {

      // 🔹 INSERT (FIRST TIME)
      await pool.query(
        `INSERT INTO setups 
        (product_id, username, system_name, business_name, domain, admin_email, logo, primary_color, secondary_color, status, step)
        VALUES  ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          product_id,
          username,
          system_name,
          business_name,
          domain,
          admin_email,
          logoPath,
          primary_color,
          secondary_color,
          "submitted"
        ]
      );
    }

    res.json({
      success: true,
      logo: logoPath
    });

  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    res.status(500).json({ success: false });
  }
});


   /*==================
     API aaproducts
     ============= */

     app.get("/api/products", (req, res) => {
  res.json(products);
});


/*==================
    ADMIN ROUTE
 ============= */

app.get("/admin", async (req, res) => {
  try {
    const clients = await pool.query("SELECT COUNT(*) FROM clients");
    const systems = await pool.query("SELECT COUNT(*) FROM systems");
    const modules = await pool.query("SELECT COUNT(*) FROM modules");
    const agents = await pool.query("SELECT COUNT(*) FROM agents");

    const content = `
      <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:20px;">
        
        <div style="padding:20px; background:#f4f4f4;">
          <h2>Clients</h2>
          <p>${clients.rows[0].count}</p>
        </div>

        <div style="padding:20px; background:#f4f4f4;">
          <h2>Systems</h2>
          <p>${systems.rows[0].count}</p>
        </div>

        <div style="padding:20px; background:#f4f4f4;">
          <h2>Modules</h2>
          <p>${modules.rows[0].count}</p>
        </div>

        <div style="padding:20px; background:#f4f4f4;">
          <h2>Agents</h2>
          <p>${agents.rows[0].count}</p>
        </div>

      </div>
    `;

    res.send(renderPage("Dashboard", content));

  } catch (err) {
    console.error(err);
    res.send(err.message);
  }
});
 


/*==================
    ADMIN Systems Route
 ============= ======*/

 app.get("/admin/systems", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id, s.name, c.name AS client
      FROM systems s
      LEFT JOIN clients c ON s.client_id = c.id
    `);

    let rows = result.rows.map(s => `
      <tr>
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.client || "N/A"}</td>
      </tr>
    `).join("");

    const content = `
      <table>
        <tr>
          <th>ID</th>
          <th>System Name</th>
          <th>Client</th>
        </tr>
        ${rows}
      </table>
    `;

    res.send(renderPage("Systems", content));

  } catch (err) {
    console.error(err);
    res.send(err.message);
  }
});


/* =========================
   Admin Modules Routes
========================= */

app.get("/admin/modules", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.id, m.name, s.name AS system
      FROM modules m
      LEFT JOIN system_modules sm ON m.id = sm.module_id
      LEFT JOIN systems s ON sm.system_id = s.id
    `);

    let rows = result.rows.map(m => `
      <tr>
        <td>${m.id}</td>
        <td>${m.name}</td>
        <td>${m.system || "N/A"}</td>
      </tr>
    `).join("");

    const content = `
      <table>
        <tr>
          <th>ID</th>
          <th>Module Name</th>
          <th>System</th>
        </tr>
        ${rows}
      </table>
    `;

    res.send(renderPage("Modules", content));

  } catch (err) {
    console.error(err);
    res.send(err.message);
  }
});

/* =========================
   Admin Agents Routes
========================= */

app.get("/admin/agents", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.id, a.name, m.name AS module
      FROM agents a
      LEFT JOIN module_agents ma ON a.id = ma.agent_id
      LEFT JOIN modules m ON ma.module_id = m.id
    `);

    let rows = result.rows.map(a => `
      <tr>
        <td>${a.id}</td>
        <td>${a.name}</td>
        <td>${a.module || "N/A"}</td>
      </tr>
    `).join("");

    const content = `
      <table>
        <tr>
          <th>ID</th>
          <th>Agent Name</th>
          <th>Module</th>
        </tr>
        ${rows}
      </table>
    `;

    res.send(renderPage("Agents", content));

  } catch (err) {
    console.error(err);
    res.send(err.message);
  }
});


/* =========================
   AGENT LOADER ENGINE
========================= */

async function loadAgent(agentName) {

  const result = await pool.query(
    "SELECT * FROM agents WHERE name = $1",
    [agentName]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

/* =========================
   AGENT ROUTER
========================= */

function agentRouter(message) {

  const text = message.toLowerCase();

  if (text.includes("crm") || text.includes("pipeline")) {
    return "crm_agent";
  }

  if (text.includes("automation") || text.includes("workflow")) {
    return "automation_agent";
  }

  if (text.includes("cloud") || text.includes("server")) {
    return "cloud_agent";
  }

  if (text.includes("security")) {
    return "security_agent";
  }

  if (text.includes("website")) {
    return "web_agent";
  }

  return "general_agent";
}

/* =========================
   TOOL SYSTEM
========================= */

function createCRM() {
  return {
    tool: "createCRM",
    result: "CRM pipeline created with stages: Lead → Qualified → Proposal → Closed"
  };
}

function createAutomationWorkflow() {
  return {
    tool: "automation",
    result: "Automation workflow created"
  };
}

function deployCloudServer() {
  return {
    tool: "cloud",
    result: "Cloud server deployment started"
  };
}

function runSecurityScan() {
  return {
    tool: "security",
    result: "Security scan running"
  };
}

/* =========================
   TOOL EXECUTOR
========================= */

async function executeTool(toolName) {

  const tool = await loadTool(toolName);

  if (!tool) {
    return {
      tool: toolName,
      result: "Tool not found"
    };
  }

  if (tool.name === "createCRM") {
    return createCRM();
  }

  if (tool.name === "automation") {
    return createAutomationWorkflow();
  }

  if (tool.name === "cloud") {
    return deployCloudServer();
  }

  if (tool.name === "security") {
    return runSecurityScan();
  }

  return {
    tool: toolName,
    result: "Tool execution not implemented"
  };

}

/* =========================
   MULTI AGENT ORCHESTRATOR
========================= */

function orchestrateAgents(message) {

  const tasks = [];

  const text = message.toLowerCase();

  if (text.includes("crm")) {
    tasks.push("crm_agent");
  }

  if (text.includes("automation")) {
    tasks.push("automation_agent");
  }

  if (text.includes("cloud")) {
    tasks.push("cloud_agent");
  }

  if (text.includes("security")) {
    tasks.push("security_agent");
  }

  if (tasks.length === 0) {
    tasks.push("general_agent");
  }

  return tasks;
}

/* =========================
   UNIVERSAL AI AGENT ENGINE
========================= */

app.post("/api/agent", verifyToken, async (req, res) => {

  try {

    const message = req.body.message;
    const user = req.user;
    const sessionId = await startAgentSession(user, "multi_agent");

    const agents = orchestrateAgents(message);
    const agentConfig = await loadAgent(agent);

    await saveMemory(user, message);

    const history = await getMemory(user);

    let toolResults = [];

for (const agent of agents) {

  if (agent === "crm_agent") {
    toolResults.push(createCRM());
  }

  if (agent === "automation_agent") {
    toolResults.push(createAutomationWorkflow());
  }

  if (agent === "cloud_agent") {
    toolResults.push(deployCloudServer());
  }

  if (agent === "security_agent") {
    toolResults.push(runSecurityScan());
  }

}

    const response = await fetch("https://api.openai.com/v1/chat/completions", {

      method: "POST",

      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: agentConfig?.system_prompt || `You are the ${agent} for Freener's Digital Services.`
          },
          ...history.map(h => ({
            role: "user",
            content: h.message
          })),
          {
            role: "user",
            content: message
          }
        ]
      })

    });

    const data = await response.json();
    await finishAgentSession(sessionId);

    res.json({
      agent,
      toolResults,
      ai: data
    });

  } catch (error) {

    res.status(500).json({
      error: "AI Agent failed"
    });

  }

});



/* =========================
   SERVER
========================= */

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});