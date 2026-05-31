async function seedAgentsCatalog(pool) {
  try {
    await pool.query(`
      INSERT INTO agents_catalog (
        id,
        name,
        full_name,

        type,
        category,
        label,

        setup_fee,
        monthly_fee,

        capability_id,
        base_capability,

        supported_targets,

        status,

        description
      ) VALUES

      (
        'agent-cyber-001',
        'Nexis',
        'Cybersecurity Agent',

        'agent',
        'Cyber-Protection',
        'Cyber Agent',

        150,
        80,

        'cap-threat-monitoring-001',
        'Threat Monitoring',

        'platform_website, external_website, platform_system, external_system, social_platforms',

        'active',

        'An intelligent cybersecurity agent engineered to safeguard digital environments, monitor threats, strengthen protection, and support secure operations across websites, systems, and external platforms.'
      ),

      (
        'agent-support-001',
        'Liora',
        'Customer Support Agent',

        'agent',
        'Customer-Support',
        'Support Agent',

        120,
        60,

        'cap-customer-response-001',
        'Customer Inquiry Response',

        'platform_website, external_website, platform_system, external_system, social_platforms',

        'active',

        'An advanced customer support agent designed to assist customers, respond to inquiries, improve response times, and enhance customer interactions across websites, systems, and social platforms.'
      ),

      (
        'agent-sales-001',
        'Velox',
        'Sales & Lead Generation Agent',

        'agent',
        'Sales-&-Lead',
        'Sales Agent',

        180,
        95,

        'cap-lead-qualification-001',
        'Lead Qualification',

        'platform_website, external_website, platform_system, external_system, social_platforms',

        'active',

        'A smart sales and lead generation agent designed to identify opportunities, qualify prospects, support customer engagement, and accelerate business growth across websites, systems, and platforms.'
      ),

      (
        'agent-marketing-001',
        'Lumora',
        'Marketing & Advertising Agent',

        'agent',
        'Marketing',
        'Marketing Agent',

        180,
        95,

        'cap-campaign-management-001',
        'Campaign Management',

        'platform_website, external_website, platform_system, external_system, social_platforms',

        'active',

        'A premium marketing and advertising agent built to strengthen brand visibility, support campaign execution, and drive business growth across digital channels.'
      ),

      (
        'agent-content-001',
        'Creova',
        'Content Creation Agent',

        'agent',
        'Content-Creation',
        'Content Agent',

        180,
        95,

        'cap-content-creation-001',
        'Content Creation',

        'platform_website, external_website, platform_system, external_system, social_platforms',

        'active',

        'A specialized content creation agent built to create, manage, and optimize digital content across websites, systems, and social platforms.'
      ),

      (
        'agent-research-001',
        'Vibexa',
        'Research & Intelligence Agent',

        'agent',
        'Research-Intelligence',
        'Research Agent',

        180,
        120,

        'cap-market-research-001',
        'Market Research',

        'platform_website, external_website, platform_system, external_system, social_platforms',

        'active',

        'An advanced research and intelligence agent designed to gather information, monitor trends, analyze competitors, identify opportunities, and provide actionable insights across  digital Market environments.'
      );
    `);

    console.log("Agents catalog seeded");

  } catch (err) {
    console.error("Agents catalog seed error:", err);
  }
}

module.exports = seedAgentsCatalog;

