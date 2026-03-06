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

/* Infrastructure status */
app.get("/api/status", (req, res) => {
  res.json({
    system: "Freener Modular Infrastructure",
    services: [
      "AI Chatbots",
      "CRM Systems",
      "Cloud Infrastructure",
      "Automation",
      "Web Apps"
    ],
    status: "Operational",
    timestamp: new Date()
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
