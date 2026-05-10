async function seedWebsitesCatalog(pool) {
  try {
    await pool.query(`
      INSERT INTO websites_catalog (
        id,
        name,
        full_name,

        type,
        category,
        label,

        setup_fee,

        basic_monthly_fee,
        standard_monthly_fee,
        legend_monthly_fee,

        basic_features,
        standard_features,
        legend_features
      ) VALUES

      (
  'web-pl-001',
  'Product Launching',
  'Product Launching Experience System',

  'website',
  'Portfolio',
  'Product Launching Website',

  650,

  49,
  79,
  129,

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),

(
  'web-pl-002',
  'Creative Portfolio',
  'Services Conversion Experience System',

  'website',
  'Portfolio',
  'Services Website',

  650,

  40,
  70,
  120,

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),


 (
  'web-pl-003',
  'Brand Portfolio',
  'Personal Brand Authority Portfolio',

  'website',
  'Portfolio',
  'Brand Website',

  650, -- setup_fee

  39,  -- current_service_fee
  69,  -- standard_plan_fee
  119, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),

(
  'web-pl-004',
  'Consultant Website',
  'Consultant Authority Landing Portfolio',

  'website',
  'Portfolio',
  'Consultant Website',

  450, -- setup_fee

  35,  -- current_service_fee
  65,  -- standard_plan_fee
  109, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),

(
  'web-pl-005',
  'Freelancer Portfolio',
  'Freelancer Conversion Portfolio',

  'website',
  'Portfolio',
  'Freelancing Website',

  450, -- setup_fee

  35,  -- current_service_fee
  65,  -- standard_plan_fee
  109, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),

(
  'web-re-031',
  'Property Listing Website',
  'Modern Property Listing Portfolio',

  'website',
  'Real-Estate',
  'Property Website',

  550, -- setup_fee

  45,  -- current_service_fee
  75,  -- standard_plan_fee
  125, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),



(
  'web-re-032',
  'Realtors Website',
  'Real Estate Agent',

  'website',
  'Real-Estate',
  'Estate Agent Website',

  550, -- setup_fee

  39, -- current_service_fee
  69, -- standard_plan_fee
  119, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),

(
  'web-re-033',
  'Rental Platform',
  'Rental Management Platform',

  'website',
  'Real-Estate',
  'Rentals Platform',

  650, -- setup_fee

  49, -- current_service_fee
  79, -- standard_plan_fee
  129, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),



(
  'web-re-034',
  'Estate Developer Website',
  'Real Estate Developers',

  'website',
  'Real-Estate',
  'Developers Website',

  650, -- setup_fee

  49, -- current_service_fee
  79, -- standard_plan_fee
  129, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),

(
  'web-re-035',
  'Land Properties Platform',
  'Landed Property Platform',

  'website',
  'Real-Estate',
  'Landed Property Website',

  450, -- setup_fee

  35, -- current_service_fee
  65, -- standard_plan_fee
  109, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),



(
  'web-eco-061',
  'Fashion Store',
  'Modern Online Store Platform',

  'website',
  'E-commerce',
  'Fashion Store',

  650, -- setup_fee

  45,  -- current_service_fee
  75,  -- standard_plan_fee
  125, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),

(
  'web-eco-062',
  'Electronics Store',
  'Modern Electronics Platform',

  'website',
  'E-commerce',
  'Electronics Store',

  700, -- setup_fee

  45,  -- current_service_fee
  75,  -- standard_plan_fee
  125, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),



(
  'web-eco-063',
  'Beauty & Skincare',
  'Modern Platform for Selling Beauty Products',

  'website',
  'E-commerce',
  'Beauty Website',

  550, -- setup_fee

  39, -- current_service_fee
  69, -- standard_plan_fee
  119, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),

(
  'web-eco-064',
  'Groceries',
  'Grocery Delivery Website',

  'website',
  'E-commerce',
  'Groceries Website',

  550, -- setup_fee

  40, -- current_service_fee
  70, -- standard_plan_fee
  120, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),


(
  'web-eco-065',
  'Mini Store',
  'Simple Mini E-commerce Website',

  'website',
  'E-commerce',
  'MiniStore',

  650, -- setup_fee

  45, -- current_service_fee
  75, -- standard_plan_fee
  125, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),

(
  'web-book-091',
  'Beauty & Spa Booking',
  'Salon & Spa Booking Website',

  'website',
  'Booking',
  'Salon & Spa Booking',

  550, -- setup_fee

  39, -- current_service_fee
  69, -- standard_plan_fee
  119, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),


(
  'web-book-092',
  'Medical Booking',
  'Doctor Appointment Website',

  'website',
  'Booking',
  'Medical Booking Platform',

  650, -- setup_fee

  49, -- current_service_fee
  79, -- standard_plan_fee
  129, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),

(
  'web-book-093',
  'Fitness Platform',
  'Fitness Booking Platform',

  'website',
  'Booking',
  'Fitness Website',

  550, -- setup_fee

  39, -- current_service_fee
  69, -- standard_plan_fee
  119, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),


(
  'web-book-094',
  'Cleaning Services',
  'Cleaning Services Platform',

  'website',
  'Booking',
  'Cleaning Website',

  450, -- setup_fee

  29, -- current_service_fee
  59, -- standard_plan_fee
  99, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),

(
  'web-book-095',
  'Car Rental Services',
  'Modern Car Rental Service Platform',

  'website',
  'Booking',
  'Car Rentals',

  450, -- setup_fee

  29, -- current_service_fee
  59, -- standard_plan_fee
  99, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),

(
  'web-corp-121',
  'Corporate Website',
  'Corporate Company Platform',

  'website',
  'Corporate',
  'Corporate Website',

  600, -- setup_fee

  49, -- current_service_fee
  79, -- standard_plan_fee
  129, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),

(
  'web-corp-122',
  'Construction Website',
  'Construction Company Platform',

  'website',
  'Corporate',
  'Construction Website',

  650, -- setup_fee

  49, -- current_service_fee
  79, -- standard_plan_fee
  129, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),

(
  'web-corp-123',
  'Law Firm Website',
  'Law Firm Platform',

  'website',
  'Corporate',
  'Law Website',

  550, -- setup_fee

  45, -- current_service_fee
  75, -- standard_plan_fee
  125, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),

(
  'web-corp-124',
  'Educational Platform',
  'Educational Institution Platform',

  'website',
  'Corporate',
  'Educational Website',

  600, -- setup_fee

  49, -- current_service_fee
  79, -- standard_plan_fee
  129, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
),


(
  'web-corp-125',
  'Manufacturing Company',
  'Manufacturing Company Platform',

  'website',
  'Corporate',
  'Manufacturing Website',

  800, -- setup_fee

  60, -- current_service_fee
  90, -- standard_plan_fee
  150, -- legend_plan_fee

  'Hosting Included, SSL Security, 5 Website Monitoring Checks Per Month, Email Support, Basic Maintenance, Standard Security Protection',

  'Managed Hosting, SSL Security, Weekly Monitoring, Priority Support, Enhanced Security Protection, Managed Maintenance, Faster Updates',

  'Premium Managed Hosting, Full Website Management, Priority Support, Unlimited Monitoring, Advanced Security Protection, Performance Optimization, Fastest Issue Resolution'
);
    `);

    console.log("Websites catalog seeded");

  } catch (err) {
    console.error("Website catalog seed error:", err);
  }
}

module.exports = seedWebsitesCatalog;