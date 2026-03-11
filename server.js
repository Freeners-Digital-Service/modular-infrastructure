const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 3000;

const JWT_SECRET = "freener_super_secret_key";

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
   AUTH LOGIN
========================= */

app.post("/auth/login", (req, res) => {
  const { user } = req.body;

  const token = jwt.sign({ user }, JWT_SECRET, {
    expiresIn: "24h"
  });

  res.json({
    message: "Login successful",
    token
  });
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
   UNIVERSAL AI AGENT ENGINE
========================= */

app.post("/api/agent", async (req, res) => {

  try {

    const message = req.body.message;
    const user = req.body.user || "default";

    const agent = agentRouter(message);

    await saveMemory(user, message);

    const history = await getMemory(user);

    let toolResult = null;

    if (agent === "crm_agent") toolResult = createCRM();
    if (agent === "automation_agent") toolResult = createAutomationWorkflow();
    if (agent === "cloud_agent") toolResult = deployCloudServer();
    if (agent === "security_agent") toolResult = runSecurityScan();

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
            content: `You are the ${agent} for Freener's Digital Services.`
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

    res.json({
      agent,
      toolResult,
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