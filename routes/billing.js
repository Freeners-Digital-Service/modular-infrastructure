const express = require("express");
const fetch = require("node-fetch");

function billingRoutes(pool, verifyToken) {
  const router = express.Router();

  /* =========================
     INITIATE PAYMENT
  ========================= */

  router.post("/pay", verifyToken, async (req, res) => {
    try {
      const {
        client_id,
        item_type,
        client_product_id,
        system_id,
        module_id,
        agent_id,
        email
      } = req.body;

      let amount = 0;
      let description = "";

      // 🔹 WEBSITE BILLING
      if (item_type === "website") {
        const result = await pool.query(
          `SELECT * FROM client_products WHERE id = $1`,
          [client_product_id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({
            error: "Website not found"
          });
        }

        const product = result.rows[0];

        amount = product.setup_fee + product.monthly_fee;
        description = "Website setup + first month";
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
        `INSERT INTO billing 
        (client_id, item_type, client_product_id, system_id, module_id, agent_id,
         amount, billing_cycle, is_initial, status, tx_ref, description)
        VALUES ($1,$2,$3,$4,$5,$6,$7,'one_time',true,'pending',$8,$9)`,
        [
          client_id,
          item_type,
          client_product_id,
          system_id,
          module_id,
          agent_id,
          amount,
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
              "https://freeners-ui-site.netlify.app/payment-success.html",
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
      console.error(err);
      res.status(500).json({ error: "Payment failed" });
    }
  });

  return router;
}

module.exports = billingRoutes;
