module.exports = [
  {
    id: "sys-ai-1",
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
  },

  {
  id: "sys-ai-2",
  name: "Sivora",
  full_name: "Lead Qualification System",
  type: "system",
  category: "Sales-Automation",
  label: "Sales Intelligence System",

  description:
    "An intelligent lead qualification system that evaluates prospects using behavioral signals, scoring logic, and data enrichment to identify high-value opportunities with precision",

  pricing: {
    setup_fee: 150,
    monthly: 95
  },

  modules: [
    { name: "Signal Analysis Engine", price: 30 },
    { name: "Lead Scoring System", price: 35 },
    { name: "Qualification Logic Builder", price: 25 },
    { name: "Data Enrichment Engine", price: 40 },
    { name: "Segment Classification Module", price: 25 },
    { name: "Insight Dashboard System", price: 20 }
  ],

  agent: "sales_agent",

  ai: {
    enabled: true,
    cost_per_request: 0.05
  }
},

{
  id: "sys-cyber-121",
  name: "Threatra",
  full_name: "Threat Detection System",
  type: "system",
  category: "cyber-threat",
  label: "Cyber Security System",

  description:
    "A system that identifies potential cyber threats using behavioral indicators, pattern deviation, and threat signature modeling",

  pricing: {
    setup_fee: 320,
    monthly: 240
  },

  modules: [
    { name: "Threat Signature Engine", price: 40 },
    { name: "Deviation Pattern Detector", price: 40 },
    { name: "Behavioral Risk Scanner", price: 35 },
    { name: "Threat Indicator Mapper", price: 35 },
    { name: "Risk Signal Aggregator", price: 45 },
    { name: "Threat Probability Engine", price: 45 }
  ],

  agent: "security_agent",

  ai: {
    enabled: true,
    cost_per_request: 0.05
  }
},

{
  id: "sys-cyber-122",
  name: "Intruxionyx",
  full_name: "Intrusion Detection System",
  type: "system",
  category: "cyber-threat",
  label: "Cyber Security System",

  description:
    "A system that detects unauthorized system entry attempts by analyzing access anomalies and unauthorized interaction patterns",

  pricing: {
    setup_fee: 350,
    monthly: 260
  },

  modules: [
    { name: "Unauthorized Access Analyzer", price: 45 },
    { name: "Entry Pattern Inspector", price: 40 },
    { name: "Access Deviation Engine", price: 40 },
    { name: "Intrusion Signal Detector", price: 45 },
    { name: "Entry Attempt Tracker", price: 45 },
    { name: "Access Violation Identifier", price: 45 }
  ],

  agent: "security_agent",

  ai: {
    enabled: true,
    cost_per_request: 0.05
  }
},

{
  id: "sys-email-241",
  name: "CamporaX",
  full_name: "Email Campaign Engine",
  type: "system",
  category: "email-campaign",
  label: "Email Automation System",

  description:
    "A structured system designed to create, manage, and execute large-scale email campaigns with controlled distribution and delivery flow",

  pricing: {
    setup_fee: 260,
    monthly: 120
  },

  modules: [
    { name: "Campaign Creation Framework", price: 20 },
    { name: "Email Dispatch Engine", price: 20 },
    { name: "Audience Segmentation Router", price: 20 },
    { name: "Campaign Timing Controller", price: 20 },
    { name: "Batch Sending Mechanism", price: 20 },
    { name: "Campaign Execution Monitor", price: 20 }
  ],

  agent: "email_agent",

  ai: {
    enabled: true,
    cost_per_request: 0.05
  }
},

{
  id: "sys-email-242",
  name: "Broadvia",
  full_name: "Broadcast Delivery System",
  type: "system",
  category: "email-campaign",
  label: "Email Automation System",

  description:
    "A mass delivery system designed to send single-message broadcasts to large audiences instantly with controlled distribution and delivery stability",

  pricing: {
    setup_fee: 240,
    monthly: 110
  },

  modules: [
    { name: "Mass Email Dispatch Engine", price: 20 },
    { name: "Audience Broadcast Controller", price: 20 },
    { name: "Delivery Load Balancer", price: 20 },
    { name: "Send Queue Manager", price: 20 },
    { name: "Broadcast Timing Switch", price: 20 },
    { name: "Delivery Status Tracker", price: 20 }
  ],

  agent: "email_agent",

  ai: {
    enabled: false
  }
},

{
  id: "sys-file-361",
  name: "Stellorix",
  full_name: "Smart Storage Engine",
  type: "system",
  category: "file",
  label: "Storage System",

  description:
    "An intelligent storage system that organizes, manages, and maintains files efficiently with optimized storage allocation",

  pricing: {
    setup_fee: 220,
    monthly: 160
  },

  modules: [
    { name: "Storage Allocation Engine", price: 30 },
    { name: "Smart File Organization System", price: 30 },
    { name: "Storage Optimization Engine", price: 25 },
    { name: "Dynamic Storage Balancer", price: 25 },
    { name: "File Structuring Module", price: 25 },
    { name: "Storage Efficiency Tracker", price: 25 }
  ],

  agent: "storage_agent",

  ai: {
    enabled: true,
    cost_per_request: 0.05
  }
},

{
  id: "sys-file-362",
  name: "Cloudara",
  full_name: "Cloud Storage System",
  type: "system",
  category: "file",
  label: "Storage System",

  description:
    "A scalable cloud-based storage system that allows secure file access, storage expansion, and remote file management",

  pricing: {
    setup_fee: 250,
    monthly: 180
  },

  modules: [
    { name: "Cloud Storage Engine", price: 30 },
    { name: "Remote Access System", price: 30 },
    { name: "Scalable Storage Module", price: 30 },
    { name: "Cloud Resource Manager", price: 25 },
    { name: "File Access Controller", price: 25 },
    { name: "Storage Expansion Engine", price: 30 }
  ],

  agent: "storage_agent",

  ai: {
    enabled: true,
    cost_per_request: 0.05
  }
},

{
  id: "sys-file-363",
  name: "Safelix",
  full_name: "Backup Storage Engine",
  type: "system",
  category: "file",
  label: "Storage System",

  description:
    "A backup system that securely stores copies of files and ensures data recovery in case of loss or system failure",

  pricing: {
    setup_fee: 200,
    monthly: 150
  },

  modules: [
    { name: "Backup Engine", price: 30 },
    { name: "Auto Backup Scheduler", price: 25 },
    { name: "Data Recovery System", price: 30 },
    { name: "Backup Version Manager", price: 25 },
    { name: "Storage Redundancy Engine", price: 25 },
    { name: "Recovery Validation Module", price: 25 }
  ],

  agent: "storage_agent",

  ai: {
    enabled: true,
    cost_per_request: 0.05
  }
},

{
  id: "sys-saas-481",
  name: "Operionyx",
  full_name: "Business Management Platform",
  type: "system",
  category: "saas-business",
  label: "Business Operating System",

  description:
    "A centralized system that manages core business operations, structure, and execution across departments through unified operational control",

  pricing: {
    setup_fee: 800,
    monthly: 220
  },

  modules: [
    { name: "Business Command Center", price: 45 },
    { name: "Operational Structure Engine", price: 40 },
    { name: "Decision Flow Controller", price: 40 },
    { name: "Execution Coordination System", price: 40 },
    { name: "Organizational Mapping Framework", price: 35 },
    { name: "Control & Oversight Engine", price: 40 }
  ],

  agent: "business_agent",

  ai: {
    enabled: true,
    cost_per_request: 0.05
  }
},

{
  id: "sys-saas-482",
  name: "Flowtrixor",
  full_name: "Operations Management SaaS",
  type: "system",
  category: "saas-business",
  label: "Business Operating System",

  description:
    "A system that manages operational workflows, execution pipelines, and real-time task flow across business activities",

  pricing: {
    setup_fee: 750,
    monthly: 200
  },

  modules: [
    { name: "Workflow Execution Engine", price: 40 },
    { name: "Task Flow Distributor", price: 35 },
    { name: "Operational Timeline Controller", price: 35 },
    { name: "Execution Load Manager", price: 35 },
    { name: "Process Adjustment System", price: 35 },
    { name: "Operational Efficiency Tracker", price: 35 }
  ],

  agent: "business_agent",

  ai: {
    enabled: true,
    cost_per_request: 0.05
  }
},


{
  id: "sys-smart-lead-601",
  name: "Capturox",
  full_name: "Lead Capture Engine",
  type: "system",
  category: "Lead-Capture",
  label: "Lead Capture System",

  description:
    "A centralized system that automatically collects, validates, and routes leads from multiple sources into a structured pipeline without manual setup",

  pricing: {
    setup_fee: 170,
    monthly: 120
  },

  modules: [
    { name: "Multi-Source Capture Engine", price: 35 },
    { name: "Auto Lead Intake System", price: 30 },
    { name: "Lead Validation Engine", price: 30 },
    { name: "Smart Routing System", price: 30 },
    { name: "Capture Activity Tracker", price: 25 },
    { name: "Duplicate Prevention Engine", price: 25 }
  ],

  agent: "lead_agent",

  ai: {
    enabled: true,
    cost_per_request: 0.05
  }
},

{
  id: "sys-smart-lead-602",
  name: "Funnelytix",
  full_name: "Form & Funnel Capture System",
  type: "system",
  category: "Lead-Capture",
  label: "Lead Capture System",

  description:
    "A pre-structured funnel system that automatically captures, processes, and qualifies leads through optimized flow paths without requiring manual funnel creation",

  pricing: {
    setup_fee: 190,
    monthly: 135
  },

  modules: [
    { name: "Pre-Built Funnel Flow Engine", price: 35 },
    { name: "Auto Lead Capture Routing", price: 30 },
    { name: "Conversion Path Optimization System", price: 35 },
    { name: "Input Processing Engine", price: 30 },
    { name: "Lead Qualification Filter", price: 30 },
    { name: "Funnel Performance Tracker", price: 30 }
  ],

  agent: "lead_agent",

  ai: {
    enabled: true,
    cost_per_request: 0.05
  }
},


{
  id: "sys-smart-lead-603",
  name: "Landora",
  full_name: "Landing Page Capture Engine",
  type: "system",
  category: "Lead-Capture",
  label: "Lead Capture System",

  description:
    "A high-conversion landing system that automatically captures leads using pre-optimized page structures and intelligent conversion triggers",

  pricing: {
    setup_fee: 200,
    monthly: 140
  },

  modules: [
    { name: "Pre-Optimized Landing System", price: 40 },
    { name: "Conversion Trigger Engine", price: 35 },
    { name: "Call-to-Action Automation", price: 30 },
    { name: "Lead Capture Processing System", price: 35 },
    { name: "Page Performance Intelligence", price: 30 },
    { name: "Conversion Testing Engine", price: 35 }
  ],

  agent: "lead_agent",

  ai: {
    enabled: true,
    cost_per_request: 0.05
  }
},

{
  id: "sys-writing-821",
  name: "Scriptara",
  full_name: "Article Writing Engine",
  type: "system",
  category: "Content-Creation",
  label: "Content Creation System",

  description:
    "A structured writing system that produces high-quality articles based on defined topics, frameworks, and content objectives for consistent publishing output",

  pricing: {
    setup_fee: 220,
    monthly: 150
  },

  modules: [
    { name: "Topic Structuring Engine", price: 35 },
    { name: "Content Flow Generator", price: 35 },
    { name: "Outline Development System", price: 30 },
    { name: "Narrative Construction Engine", price: 35 },
    { name: "Article Formatting Module", price: 30 },
    { name: "Output Consistency Tracker", price: 30 }
  ],

  agent: "content_agent",

  ai: {
    enabled: true,
    cost_per_request: 0.05
  }
},


{
  id: "sys-writing-822",
  name: "Persuadix",
  full_name: "Copywriting Engine",
  type: "system",
  category: "Content-Creation",
  label: "Content Creation System",

  description:
    "A conversion-focused writing system designed to craft persuasive messaging that drives action, engagement, and response across marketing channels",

  pricing: {
    setup_fee: 240,
    monthly: 170
  },

  modules: [
    { name: "Persuasion Framework Engine", price: 40 },
    { name: "Headline Optimization System", price: 35 },
    { name: "Call-to-Action Generator", price: 35 },
    { name: "Emotional Trigger Engine", price: 35 },
    { name: "Message Structuring Module", price: 30 },
    { name: "Conversion Copy Analyzer", price: 35 }
  ],

  agent: "content_agent",

  ai: {
    enabled: true,
    cost_per_request: 0.05
  }
}

];

