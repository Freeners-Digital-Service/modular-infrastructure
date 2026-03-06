const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
