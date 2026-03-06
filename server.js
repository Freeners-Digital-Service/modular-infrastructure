const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* Root route */
app.get("/", (req, res) => {
  res.json({
    status: "Modular Infrastructure Running",
    author: "Freener Awhaefe",
    version: "1.0.0"
  });
});

/* Health check */
app.get("/health", (req, res) => {
  res.json({
    uptime: process.uptime(),
    message: "System healthy",
    timestamp: new Date()
  });
});


/* AI Chatbots */
app.get("/api/chatbots", (req, res) => {
  res.json({
    service: "AI Chatbots",
    status: "Operational",
    timestamp: new Date()
  });
});

/* CRM Systems */
app.get("/api/crm", (req, res) => {
  res.json({
    service: "CRM Systems",
    status: "Operational",
    timestamp: new Date()
  });
});

/* Cloud Infrastructure */
app.get("/api/cloud", (req, res) => {
  res.json({
    service: "Cloud Infrastructure",
    status: "Operational",
    timestamp: new Date()
  });
});

/* Automation */
app.get("/api/automation", (req, res) => {
  res.json({
    service: "Automation",
    status: "Operational",
    timestamp: new Date()
  });
});

/* Web Apps */
app.get("/api/webapps", (req, res) => {
  res.json({
    service: "Web Apps",
    status: "Operational",
    timestamp: new Date()
  });
});

/* OpenAI Chat Route */
app.post("/api/chatbots/ai", async (req, res) => {
  try {
    const message = req.body.message;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: "AI request failed" });
  }
});

/* AI Agent Engine */

app.post("/api/agent", async (req, res) => {

  try {

    const message = req.body.message;

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
            content: "You are an AI agent for Freener's Digital Services. You help users automate tasks like CRM setup, automation workflows, cloud setup, cybersecurity scans and web applications."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    res.json(data);

  } catch (error) {

    res.status(500).json({
      error: "AI Agent failed"
    });

  }

});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
