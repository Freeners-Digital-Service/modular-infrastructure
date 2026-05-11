/* =========================
   UNIVERSAL WEBSITE LAUNCH FORM
========================= */

const websitesLaunchForm = {

  item_type: "website",

  fields: [

    {
      label: "Business Name",
      name: "business_name",
      type: "text",
      required: true,
      placeholder: "Enter your business name"
    },

    {
      label: "Business Email",
      name: "business_email",
      type: "email",
      required: true,
      placeholder: "Enter your business email"
    },

    {
      label: "Phone Number",
      name: "phone",
      type: "text",
      required: true,
      placeholder: "Enter your phone number"
    },

    {
      label: "Brand Color",
      name: "brand_color",
      type: "color",
      required: false
    },

    {
      label: "Custom Domain (Optional)",
      name: "domain",
      type: "text",
      required: false,
      placeholder: "example.com"
    },

    {
      label: "Business Logo",
      name: "logo_file",
      type: "file",
      required: false
    },

    {
  label: "Business Industry",
  name: "business_industry",
  type: "text",
  required: false,
  placeholder: "e.g Restaurant, Real Estate, Finance"
},

{
  label: "Business Address (Optional)",
  name: "business_address",
  type: "text",
  required: false,
  placeholder: "Enter business address"
},

{
  label: "Social Media Links (Optional)",
  name: "social_links",
  type: "text",
  required: false,
  placeholder: "Instagram, Facebook, LinkedIn..."
},

{
  label: "Preferred Contact Method",
  name: "contact_method",
  type: "select",
  required: false,
  options: [
    "Email",
    "Phone",
    "WhatsApp"
  ]
}


  ]

};

module.exports = websitesLaunchForm;