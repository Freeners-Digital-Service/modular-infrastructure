/* =========================
   UNIVERSAL SYSTEM LAUNCH FORM
========================= */

const systemLaunchForm = {

  item_type: "system",

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
    }

  ]

};

module.exports = systemLaunchForm;
