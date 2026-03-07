const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
  res.json({
    service: "AI Chatbots",
    status: "Operational",
    timestamp: new Date()
  });
});

app.get("/api/crm", (req, res) => {
  res.json({
    service: "CRM Systems",
    status: "Operational",
    timestamp: new Date()
  });
});

app.get("/api/cloud", (req, res) => {
  res.json({
    service: "Cloud Infrastructure",
    status: "Operational",
    timestamp: new Date()
  });
});

app.get("/api/automation", (req, res) => {
  res.json({
    service: "Automation",
    status: "Operational",
    timestamp: new Date()
  });
});

app.get("/api/webapps", (req, res) => {
  res.json({
    service: "Web Apps",
    status: "Operational",
    timestamp: new Date()
  });
});

/* =========================
   AGENT ROUTER
========================= */

function agentRouter(message) {

  const text = message.toLowerCase();

  if (text.includes("crm") || text.includes("pipeline") || text.includes("sales")) {
    return "crm_agent";
  }

  if (text.includes("automation") || text.includes("workflow") || text.includes("automate")) {
    return "automation_agent";
  }

  if (text.includes("cloud") || text.includes("server") || text.includes("aws")) {
    return "cloud_agent";
  }

  if (text.includes("security") || text.includes("cyber")) {
    return "security_agent";
  }

  if (text.includes("website") || text.includes("web app")) {
    return "web_agent";
  }

  return "general_agent";
}

/* =========================
   UNIVERSAL AI AGENT ENGINE
========================= */

app.post("/api/agent", async (req, res) => {

  try {

    const message = req.body.message;

    const agent = agentRouter(message);

    console.log("Agent selected:", agent);

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
            content: `You are the ${agent} for Freener's Digital Services. Execute tasks related to this service.`
          },
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
      response: data
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