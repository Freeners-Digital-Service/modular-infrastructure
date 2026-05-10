process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("🔥 Unhandled Rejection:", err);
});

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
const path = require("path");
const multer = require("multer");
const adminMain = require("./routes/adminMain");
const renderPage = require("./admin/layout");
const authRoutes = require("./routes/auth");
const verifyToken = require("./routes/verify");
const adminClients = require("./routes/adminClients");
const adminSystems = require("./routes/adminSystems");
const adminModules = require("./routes/adminModules");
const adminAgents = require("./routes/adminAgents");
const adminClientSystems = require("./routes/adminClientSystems");
const adminSystemModules = require("./routes/adminSystemModules");
const adminModuleAgents = require("./routes/adminModuleAgents");
const adminAgentSessions = require("./routes/adminAgentSessions");
const adminAgentTasks = require("./routes/adminAgentTasks");
const adminUsers = require("./routes/adminUsers");
const adminActivityLogs = require("./routes/adminActivityLogs");
const adminSystemLogs = require("./routes/adminSystemLogs");
const adminAlerts = require("./routes/adminAlerts");
const adminAnalyticsEvents = require("./routes/adminAnalyticsEvents");
const adminSystemHealth = require("./routes/adminSystemHealth");
const adminDeployments = require("./routes/adminDeployments");
const adminPricing = require("./routes/adminPricing");
const adminClientAgents = require("./routes/adminClientAgents");
const adminClientModules = require("./routes/adminClientModules");
const systemWebsiteConnections = require("./routes/systemWebsiteConnections");
const websitesCatalog = require("./routes/websitesCatalog");
const clientProducts = require("./routes/clientProducts");
const adminSystemConnections = require("./routes/adminSystemConnections");
const billingRoutes = require("./routes/billing");
const systemsCatalog = require("./routes/systemsCatalog");
const seedSystemsCatalog = require("./db/systemsCatalogSeed");
const seedWebsitesCatalog =require("./db/websitesCatalogSeed");
const setupRoutes = require("./routes/setupRoutes");





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
app.use("/auth", authRoutes(pool));
app.use("/admin", verifyToken, adminMain(pool, renderPage));
app.use("/admin", verifyToken, adminClients(pool, renderPage));
app.use("/admin", verifyToken, adminSystems(pool, renderPage));
app.use("/admin", verifyToken, adminModules(pool, renderPage));
app.use("/admin", verifyToken, adminAgents(pool, renderPage));
app.use("/admin", verifyToken, adminClientSystems(pool, renderPage));
app.use("/admin", verifyToken, adminSystemModules(pool, renderPage));
app.use("/admin", verifyToken, adminModuleAgents(pool, renderPage));
app.use("/admin", verifyToken, adminAgentSessions(pool, renderPage));
app.use("/admin", verifyToken, adminAgentTasks(pool, renderPage));
app.use("/admin", verifyToken, adminUsers(pool, renderPage));
app.use("/admin", verifyToken, adminActivityLogs(pool, renderPage));
app.use("/admin", verifyToken, adminSystemLogs(pool, renderPage));
app.use("/admin", verifyToken, adminAlerts(pool, renderPage));
app.use("/admin", verifyToken, adminAnalyticsEvents(pool, renderPage));
app.use("/admin", verifyToken, adminSystemHealth(pool, renderPage));
app.use("/admin", verifyToken, adminDeployments(pool, renderPage));
app.use("/admin", verifyToken, adminPricing(pool, renderPage));
app.use("/admin", verifyToken, adminClientAgents(pool, renderPage));
app.use("/admin", verifyToken, adminClientModules(pool, renderPage));
app.use("/api/system-website", systemWebsiteConnections(pool));
app.use("/api/websites", websitesCatalog(pool));
app.use("/api/client-products", clientProducts(pool));
app.use("/admin", verifyToken, adminSystemConnections(pool, renderPage));
app.use("/api/billing", billingRoutes(pool));
app.use("/api/systems", systemsCatalog(pool));
app.use("/api/setup", setupRoutes(pool, upload));






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
   SETUP SUBMISSIONS TABLE
========================= */

(async () => {
  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS setups (

        id SERIAL PRIMARY KEY,

        /* ITEM INFO */
        item_type TEXT,

        system_id TEXT,
        website_id TEXT,

        system_name TEXT,
        website_name TEXT,

        category TEXT,
        label TEXT,

        /* CLIENT INFO */
        business_name TEXT,
        business_email TEXT,
        phone TEXT,

        logo TEXT,
        brand_color TEXT,
        domain TEXT,

        /* FLEXIBLE EXTRA DATA */
        data JSONB,

        /* FLOW TRACKING */
        step INTEGER DEFAULT 1,
        status TEXT DEFAULT 'pending',

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

      );
    `);

    console.log("Setup submissions table ready");

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


/* =========================
   CLIENT AGENTS TABLE
========================= */
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS client_agents (
        id SERIAL PRIMARY KEY,

        client_id INTEGER,
        system_id INTEGER,
        module_id INTEGER,
        agent_id INTEGER,

        status TEXT DEFAULT 'active',   -- active / inactive

        activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Client agents table ready");
  } catch (err) {
    console.error("Client agents table error:", err);
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
   CLIENT MODULES TABLE
========================= */
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS client_modules (
        id SERIAL PRIMARY KEY,

        client_id INTEGER,
        system_id INTEGER,
        module_id INTEGER,

        status TEXT DEFAULT 'active',   -- active / inactive

        activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Client modules table ready");
  } catch (err) {
    console.error("Client modules table error:", err);
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

 -- CORE ITEM IDENTIFICATION
 item_type TEXT,  -- 'website' | 'system' | 'module' | 'agent'

 -- RELATION LINKS
 client_product_id INTEGER,  
 website_id TEXT,
 selected_plan TEXT,
 system_id TEXT,
 module_id INTEGER,
 agent_id INTEGER,

 -- BILLING DETAILS
 amount NUMERIC,
 plan_price NUMERIC,
 billing_cycle TEXT, -- 'one_time' | 'monthly'
 is_initial BOOLEAN DEFAULT false, -- first payment flag

 status TEXT DEFAULT 'pending', -- pending | paid | failed

 -- PAYMENT TRACKING
 tx_ref TEXT,
 flutterwave_tx_id TEXT,
 payment_method TEXT,

 -- META
 description TEXT,

 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );
 `);

 // ✅ SAFE UPDATE (FOR EXISTING DB)
 await pool.query(`
 ALTER TABLE billing
 ADD COLUMN IF NOT EXISTS item_type TEXT,
 ADD COLUMN IF NOT EXISTS client_product_id INTEGER,
 ADD COLUMN IF NOT EXISTS website_id TEXT,
 ADD COLUMN IF NOT EXISTS selected_plan TEXT,
 ADD COLUMN IF NOT EXISTS system_id TEXT,
 ADD COLUMN IF NOT EXISTS module_id INTEGER,
 ADD COLUMN IF NOT EXISTS agent_id INTEGER,
 ADD COLUMN IF NOT EXISTS amount NUMERIC,
 ADD COLUMN IF NOT EXISTS plan_price NUMERIC,
 ADD COLUMN IF NOT EXISTS billing_cycle TEXT,
 ADD COLUMN IF NOT EXISTS is_initial BOOLEAN DEFAULT false,
 ADD COLUMN IF NOT EXISTS tx_ref TEXT,
 ADD COLUMN IF NOT EXISTS flutterwave_tx_id TEXT,
 ADD COLUMN IF NOT EXISTS payment_method TEXT,
 ADD COLUMN IF NOT EXISTS description TEXT;
 `);

 console.log("Billing table ready (FINAL STRUCTURE)");
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

        website_id TEXT,
        selected_plan TEXT,
        system_id TEXT,     -- setup fee only
        module_id INTEGER,     -- module monthly
        agent_id INTEGER,      -- agent monthly

        setup_fee NUMERIC,     -- one-time (system)
        price NUMERIC,         -- monthly (module / agent)

        billing_cycle TEXT,    -- monthly

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Safe update for existing table
    await pool.query(`
      ALTER TABLE pricing
ADD COLUMN IF NOT EXISTS website_id TEXT,
ADD COLUMN IF NOT EXISTS selected_plan TEXT,

ADD COLUMN IF NOT EXISTS system_id TEXT,
ADD COLUMN IF NOT EXISTS module_id INTEGER,
ADD COLUMN IF NOT EXISTS agent_id INTEGER,

ADD COLUMN IF NOT EXISTS setup_fee NUMERIC,
ADD COLUMN IF NOT EXISTS price NUMERIC,
ADD COLUMN IF NOT EXISTS billing_cycle TEXT;
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
    description TEXT,
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
CONNECT SYSTEMS TO CLIENTS Tables
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS client_systems (
  id SERIAL PRIMARY KEY,
  client_id INTEGER,
  system_id TEXT,
  status TEXT DEFAULT 'configuring',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `);

    console.log("Client systems table ready");
  } catch (err) {
    console.error("Client systems table error:", err);
  }
})();

/* =========================
   SYSTEMS CATALOG TABLE
========================= */

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS systems_catalog (
        id TEXT PRIMARY KEY,

        name TEXT,
        full_name TEXT,
        type TEXT,
        category TEXT,
        label TEXT,

        description TEXT,

        setup_fee NUMERIC,
        monthly_fee NUMERIC,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Systems catalog table ready");
  } catch (err) {
    console.error("Systems catalog table error:", err);
  }
})();


/* =========================
   WEBSITES CATALOG TABLE
========================= */
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS websites_catalog (
  id TEXT PRIMARY KEY,

  name TEXT,
  full_name TEXT,

  type TEXT,
  category TEXT,
  label TEXT,

  description TEXT,

  setup_fee NUMERIC,

  basic_monthly_fee NUMERIC,
  standard_monthly_fee NUMERIC,
  legend_monthly_fee NUMERIC,

  basic_features TEXT,
  standard_features TEXT,
  legend_features TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Websites catalog table ready (clean)");
  } catch (err) {
    console.error("Websites catalog table error:", err);
  }
})();

/* =========================
   CLIENT PRODUCTS (WEBSITES)
========================= */
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS client_products (
  id SERIAL PRIMARY KEY,

  client_id INTEGER,
  website_id TEXT,

  selected_plan TEXT,

  status TEXT DEFAULT 'configuring',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Client products table ready");
  } catch (err) {
    console.error("Client products table error:", err);
  }
})();


/* =========================
   SYSTEM ↔ WEBSITE CONNECTION
========================= */
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_website_connections (
        id SERIAL PRIMARY KEY,

        client_id INTEGER,

        system_id INTEGER,      -- from client_systems
        website_id INTEGER,     -- from client_products

        status TEXT DEFAULT 'connected',   -- connected / disconnected

        connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ✅ ADD NEW COLUMN (SAFE UPDATE)
    await pool.query(`
      ALTER TABLE system_website_connections
      ADD COLUMN IF NOT EXISTS client_product_id INTEGER;
    `);

    console.log("System-Website connection table ready + updated");
  } catch (err) {
    console.error("System-Website connection error:", err);
  }
})();


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

(async () => {
  await seedSystemsCatalog(pool);
  await seedWebsitesCatalog(pool);
})();