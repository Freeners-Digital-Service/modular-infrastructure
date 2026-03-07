const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* =========================
   MONGODB CONNECTION
========================= */

const client = new MongoClient(process.env.MONGODB_URI);

let db;

async function connectDB() {
  await client.connect();
  db = client.db("freener_ai");
  console.log("MongoDB connected");
}

connectDB();

/* =========================
   MEMORY FUNCTIONS
========================= */

async function saveMemory(user, message) {
  await db.collection("memory").insertOne({
    user,
    message,
    time: new Date()
  });
}

async function getMemory(user) {
  return await db
    .collection("memory")
    .find({ user })
    .sort({ time: -1 })
    .limit(5)
    .toArray();
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