/* =========================
   UNIVERSAL AGENT LAUNCH FORM
========================= */

const agentsLaunchForm = {

  item_type: "agent",

  fields: [

    {
      label: "Confirm Agent Name",
      name: "agent_name",
      type: "text",
      required: true,
      readonly: true
    },

    {
      label: "Choose Target",
      name: "target_type",
      type: "select",
      required: true,
      options: [
        "Platform Website",
        "External Website",
        "Platform System",
        "External System",
        "Social Platform"
      ]
    },

    /* =========================
       PLATFORM WEBSITE
    ========================= */

    {
      label: "Select Website",
      name: "selected_website",
      type: "select",
      required: false
    },

    /* =========================
       EXTERNAL WEBSITE
    ========================= */

    {
      label: "Website Name",
      name: "website_name",
      type: "text",
      required: false,
      placeholder: "Enter website name"
    },

    {
      label: "Website URL",
      name: "website_url",
      type: "text",
      required: false,
      placeholder: "https://example.com"
    },

    {
      label: "Website Platform",
      name: "website_platform",
      type: "select",
      required: false,
      options: [
        "WordPress",
        "Shopify",
        "Wix",
        "Webflow",
        "Custom",
        "Other"
      ]
    },

    /* =========================
       PLATFORM SYSTEM
    ========================= */

    {
      label: "Select System",
      name: "selected_system",
      type: "select",
      required: false
    },

    /* =========================
       EXTERNAL SYSTEM
    ========================= */

    {
      label: "System Name",
      name: "system_name",
      type: "text",
      required: false,
      placeholder: "Enter system name"
    },

    {
      label: "System URL",
      name: "system_url",
      type: "text",
      required: false,
      placeholder: "https://system-url.com"
    },

    {
      label: "System Type",
      name: "system_type",
      type: "select",
      required: false,
      options: [
        "CRM",
        "ERP",
        "Inventory System",
        "Accounting System",
        "HR System",
        "Custom System",
        "Other"
      ]
    },

    /* =========================
       SOCIAL PLATFORM
    ========================= */

    {
      label: "Platform Name",
      name: "platform_name",
      type: "select",
      required: false,
      options: [
        "Facebook",
        "Instagram",
        "LinkedIn",
        "X",
        "TikTok",
        "YouTube",
        "WhatsApp",
        "Telegram",
        "Other"
      ]
    },

    {
      label: "Account/Page Name",
      name: "account_name",
      type: "text",
      required: false,
      placeholder: "Enter account or page name"
    },

    {
      label: "Profile/Page URL",
      name: "profile_url",
      type: "text",
      required: false,
      placeholder: "https://..."
    },

    /* =========================
       AGENT BEHAVIOR
    ========================= */

    {
      label: "Agent Behavior",
      name: "agent_behavior",
      type: "multiselect",
      required: false,
      options: [
        "View Information Only",
        "Monitor & Alert Me",
        "Full Agent Control"
      ]
    },

    /* =========================
       ADDITIONAL INFORMATION
    ========================= */

    {
      label: "Additional Information",
      name: "additional_information",
      type: "textarea",
      required: false,
      placeholder:
        "Please provide any details our team should know before connecting this agent."
    },

    /* =========================
       PREFERRED CONTACT METHOD
    ========================= */

    {
      label: "Preferred Contact Method",
      name: "contact_method",
      type: "select",
      required: false,
      options: [
        "Email",
        "WhatsApp",
        "Phone"
      ]
    }

  ]

};

module.exports = agentsLaunchForm;
