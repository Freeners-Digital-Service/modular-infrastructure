const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 3000;

const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

/* =========================
   POSTGRES MEMORY
========================= */

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "",
  ssl: { rejectUnauthorized: false }
});

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
   MARKETPLACE PRODUCTS
========================= */

app.get("/api/marketplace/products", async (req, res) => {

  try {

    const products = await getMarketplaceProducts();

    res.json(products);

  } catch (error) {

    res.status(500).json({
      error: "Marketplace fetch failed"
    });

  }

});

/* =========================
   ADD AGENT (ADMIN)
========================= */

app.post("/api/agents", async (req, res) => {

  try {

    const { name, description, system_prompt } = req.body;

    await pool.query(
      "INSERT INTO agents (name, description, system_prompt) VALUES ($1, $2, $3)",
      [name, description, system_prompt]
    );

    res.json({
      message: "Agent created successfully"
    });

  } catch (error) {

    res.status(500).json({
      error: "Agent creation failed"
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