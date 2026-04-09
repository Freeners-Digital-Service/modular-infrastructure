module.exports = [
  {
    id: 1,
    name: "Velora",
    full_name: "Funnel Automation Engine",
    type: "system",
    category: "Sales-Automation",
    label: "Sales Automation System",

    description:
      "A high-performance funnel automation system that guides prospects through structured conversion paths using intelligent workflows, dynamic routing, and automated engagement sequences",

    pricing: {
      setup_fee: 180,
      monthly: 120
    },

    modules: [
      { name: "Funnel Architecture Module", price: 45 },
      { name: "Entry Capture System", price: 35 },
      { name: "Journey Routing Engine", price: 35 },
      { name: "Conversion Path Optimizer", price: 40 },
      { name: "Automation Flow Controller", price: 30 },
      { name: "Funnel Performance Tracker", price: 35 }
    ],

    agent: "sales_agent",

    ai: {
      enabled: true,
      cost_per_request: 0.01
    }
  }
];
