const express = require("express");
const fetch = require("node-fetch");

function billingRoutes(pool) {
  const router = express.Router();

  /* =========================
     INITIATE PAYMENT
  ========================= */

 router.post("/pay", async (req, res) => {
    try {
      const {
      client_id,
      item_type,

      website_id,
      selected_plan,

      client_product_id,
      system_id,
      module_id,
      agent_id,

      email
    } = req.body;

      let amount = 0;
       let planPrice = 0;
      let description = "";

      // 🔹 WEBSITE BILLING
      if (item_type === "website") {

  const result = await pool.query(
    `SELECT * FROM websites_catalog WHERE id = $1`,
    [website_id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: "Website not found"
    });
  }

  const website = result.rows[0];

  let monthlyFee = 0;

  if (selected_plan === "basic") {
    monthlyFee = Number(website.basic_monthly_fee);
  }

  if (selected_plan === "standard") {
    monthlyFee = Number(website.standard_monthly_fee);
  }

  if (selected_plan === "legend") {
    monthlyFee = Number(website.legend_monthly_fee);
  }

  amount =
    Number(website.setup_fee) +
    monthlyFee;

    planPrice = monthlyFee;

  description =
    `${website.name} setup + first month (${selected_plan} plan)`;
}


      // 🔥 SYSTEM BILLING
if (system_id) {
  const result = await pool.query(
    `SELECT * FROM systems_catalog WHERE id = $1`,
    [system_id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: "System not found"
    });
  }

  const system = result.rows[0];

  amount = Number(system.setup_fee) + Number(system.monthly_fee);
  description = system.name + " setup + first month";
 
}

      // ⚠️ FUTURE: system / module / agent here

      if (amount <= 0) {
        return res.status(400).json({
          error: "Invalid billing amount"
        });
      }

      const tx_ref = "freener_" + Date.now();

      // 🔹 CREATE BILLING (PENDING)
await pool.query(
  `INSERT INTO billing (
    client_id, 
    item_type,

    client_product_id,
    website_id,
    selected_plan,

    system_id,
    module_id,
    agent_id,

    amount,
    plan_price,

    billing_cycle,
    is_initial,
    status,

    tx_ref,
    description
  )
  VALUES (
    $1,$2,$3,$4,$5,
    $6,$7,$8,
    $9,$10,
    'one_time',
    true,
    'pending',
    $11,$12
  )`,
  [
    client_id,
    item_type,

    client_product_id ?? null,
    website_id ?? null,
    selected_plan ?? null,

    system_id ?? null,
    module_id ?? null,
    agent_id ?? null,

    amount,
    planPrice ?? null,

    tx_ref,
    description
  ]
);


      // 🔹 FLUTTERWAVE
      const response = await fetch(
        "https://api.flutterwave.com/v3/payments",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            tx_ref,
            amount,
            currency: "USD",
            redirect_url:
              `https://freeners-ui-site.netlify.app/payment-success.html?type=${item_type}`,
            customer: { email },
            customizations: {
              title: "Freener Payment",
              description
            }
          })
        }
      );

   const data = await response.json();
    res.json(data);

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({
      error: err.message
    });
  }


  /* =========================
   FLUTTERWAVE WEBHOOK
========================= */

  router.post("/webhook/flutterwave", async (req, res) => {
  try {
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
    const signature = req.headers["verif-hash"];

    if (!signature || signature !== secretHash) {
      return res.status(401).send("Unauthorized");
    }

    const payload = req.body;

    if (
      payload.data &&
      payload.data.status === "successful"
    ) {
      const tx_ref = payload.data.tx_ref;
      const transaction_id = payload.data.id;

      // 🔍 Get billing record first
      const billingRes = await pool.query(
        `SELECT * FROM billing WHERE tx_ref = $1`,
        [tx_ref]
      );

      if (billingRes.rows.length === 0) {
        return res.sendStatus(200);
      }

      const billing = billingRes.rows[0];

      // 🔐 Verify with Flutterwave
      const verifyRes = await fetch(
        `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
          }
        }
      );

      const verifyData = await verifyRes.json();

      if (
        verifyData.status === "success" &&
        verifyData.data.status === "successful"
      ) {
        // ✅ Update billing
        await pool.query(
          `UPDATE billing
           SET status = 'paid',
               flutterwave_tx_id = $1,
               payment_method = $2
           WHERE tx_ref = $3`,
          [
            transaction_id,
            verifyData.data.payment_type,
            tx_ref
          ]
        );

        // 🔥 CREATE PRODUCT / SYSTEM FOR CLIENT

if (billing.item_type === "website") {

  // Prevent duplicate website provisioning
  const existingWebsite = await pool.query(
    `SELECT * FROM client_products
     WHERE client_id = $1
     AND website_id = $2`,
    [billing.client_id, billing.website_id]
  );

  if (existingWebsite.rows.length === 0) {
    await pool.query(
      `INSERT INTO client_products
      (
        client_id,
        website_id,
        selected_plan,
        status
      )
      VALUES ($1, $2, $3, 'configuring')`,
      [
        billing.client_id,
        billing.website_id,
        billing.selected_plan
      ]
    );
  }
}

if (billing.item_type === "system" || billing.system_id) {

  // Prevent duplicate system provisioning
  const existingSystem = await pool.query(
    `SELECT * FROM client_systems
     WHERE client_id = $1
     AND system_id = $2`,
    [billing.client_id, billing.system_id]
  );

  if (existingSystem.rows.length === 0) {
    await pool.query(
      `INSERT INTO client_systems
      (client_id, system_id, status)
      VALUES ($1, $2, 'configuring')`,
      [
        billing.client_id,
        billing.system_id
      ]
    );
  }
}

console.log("✅ Payment confirmed & product unlocked:", tx_ref);

      }
    }

    res.sendStatus(200);

  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});

/* =========================
   PAYMENT STATUS
========================= */

router.get("/payment-status", async (req, res) => {

  try {

    const { tx_ref } = req.query;

    if (!tx_ref) {
      return res.status(400).json({
        success: false,
        error: "Missing tx_ref"
      });
    }

    const result = await pool.query(
      `SELECT * FROM billing
       WHERE tx_ref = $1`,
      [tx_ref]
    );

    if (result.rows.length === 0) {

      return res.json({
        success: false,
        status: "not_found"
      });

    }

    const billing = result.rows[0];

    res.json({
      success: true,
      status: billing.status,
      billing
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false
    });

  }

});



  });
  return router;
}

module.exports = billingRoutes;
