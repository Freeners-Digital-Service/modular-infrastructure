async function seedSystemsCatalog(pool) {
  try {
    await pool.query(`
      INSERT INTO systems_catalog (
        id, name, full_name, type, category, label, description, setup_fee, monthly_fee
      ) VALUES
      ('sys-ai-1','Velora','Funnel Automation Engine'
      ,'system','Sales-Automation','Sales Automation System'
      ,'A high-performance funnel automation system that guides prospects through structured conversion paths using intelligent workflows, dynamic routing, and automated engagement sequences',180,120),
     
      ('sys-ai-2','Sivora','Lead Qualification System'
      ,'system','Sales-Automation','Sales Intelligence System'
      ,'An intelligent lead qualification system that evaluates prospects using behavioral signals, scoring logic, and data enrichment to identify high-value opportunities with precision',150,95),
      
      ('sys-ai-3','Nemoris','Follow-up Automation System'
      ,'system','Sales-Automation','Engagement Automation System'
      ,'A continuous engagement system that automates follow-up interactions through adaptive timing, behavioral triggers, and personalized communication sequences to maintain lead momentum',150,95),


      ('sys-cyber-121','Threatra','Threat Detection System'
      ,'system','cyber-threat','Cyber Security System'
      ,'A system that identifies potential cyber threats using behavioral indicators, pattern deviation, and threat signature modeling',320,240),

      ('sys-cyber-122','Intruxionyx','Intrusion Detection System'
      ,'system','cyber-threat','Cyber Security System'
      ,'A system that detects unauthorized system entry attempts by analyzing access anomalies and unauthorized interaction patterns',350,260),

      ('sys-cyber-123','Behavionyx','Behavior Monitoring System'
      ,'system','cyber-threat','Cyber Security System'
      ,'A system that detects abnormal user and system behaviors by analyzing behavioral baselines and identifying suspicious activity shifts',330,250),


      ('sys-email-241','CamporaX','Email Campaign Engine'
      ,'system','email-campaign','Email Automation System'
      ,'A structured system designed to create, manage, and execute large-scale email campaigns with controlled distribution and delivery flow',260,120),

      ('sys-email-242','Broadvia','Broadcast Delivery System'
      ,'system','email-campaign','Email Automation System'
      ,'A mass delivery system designed to send single-message broadcasts to large audiences instantly with controlled distribution and delivery stability',240,110),

      ('sys-email-243','"Schedulix','Campaign Scheduling Engin'
      ,'system','email-campaign','Email Automation System'
      ,'A timing-focused system that schedules and controls when campaigns are executed based on defined time rules and delivery windows',250,105),


      ('sys-file-361','Stellorix','Smart Storage Engine'
      ,'system','file','Storage System'
      ,'An intelligent storage system that organizes, manages, and maintains files efficiently with optimized storage allocation',220,160),

      ('sys-file-362','Cloudara','Cloud Storage System'
      ,'system','file','Storage System'
      ,'A scalable cloud-based storage system that allows secure file access, storage expansion, and remote file management',250,180),

      ('sys-file-363','Safelix','Backup Storage Engine'
      ,'system','file','Storage System'
      ,'A backup system that securely stores copies of files and ensures data recovery in case of loss or system failure',200,150),

      ('sys-saas-481','Operionyx','Business Management Platform'
      ,'system','saas-business','Business Operating System'
      ,'A centralized system that manages core business operations, structure, and execution across departments through unified operational control',800,220),

      ('sys-saas-482','Flowtrixor','Operations Management SaaS'
      ,'system','saas-business','Business Operating System'
      ,'A system that manages operational workflows, execution pipelines, and real-time task flow across business activities',750,200),

      ('sys-saas-483','"Relatixor','"CRM SaaS System"'
      ,'system','saas-business','"Business Operating System"'
      ,'A relationship intelligence system that manages customer interactions, lifecycle stages, and communication history across all touchpoints',750,210),

      ('sys-smart-lead-601','Capturox','Lead Capture Engine'
      ,'system','Lead-Capture','Lead Capture System'
      ,'A centralized system that automatically collects, validates, and routes leads from multiple sources into a structured pipeline without manual setup',170,120),

      ('sys-smart-lead-602','Funnelytix','Form & Funnel Capture System'
      ,'system','Lead-Capture','Lead Capture System'
      ,'A pre-structured funnel system that automatically captures, processes, and qualifies leads through optimized flow paths without requiring manual funnel creation',190,135),

      ('sys-smart-lead-603','Landora','Landing Page Capture Engine'
      ,'system','Lead-Capture','Lead Capture System'
      ,'A high-conversion landing system that automatically captures leads using pre-optimized page structures and intelligent conversion triggers',200,140),

      ('sys-writing-821','Scriptara','Article Writing Engine'
      ,'system','Content-Creation','Content Creation System'
      ,'A structured writing system that produces high-quality articles based on defined topics, frameworks, and content objectives for consistent publishing output',220,150),

      ('sys-writing-822','Persuadix','Copywriting Engine'
      ,'system','Content-Creation','Content Creation System'
      ,'A conversion-focused writing system designed to craft persuasive messaging that drives action, engagement, and response across marketing channels',240,170)

      ('sys-writing-823','Narrivon','Script Writing Engine'
      ,'system','Content-Creation','Content Creation System'
      ,'"A narrative-driven system that creates structured scripts for videos, presentations, and storytelling formats with clear flow and engagement hooks',250,160)


      ON CONFLICT (id) DO NOTHING;
    `);

    console.log("Systems catalog seeded (real data)");
  } catch (err) {
    console.error("Systems seed error:", err);
  }
}

module.exports = seedSystemsCatalog;