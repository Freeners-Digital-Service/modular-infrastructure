const express = require("express");

const systemLaunchForm =
require("../db/systemLaunchForm");
const websitesLaunchForm =
require("../db/websitesLaunchForm");

function setupRoutes(pool, upload) {

  const router = express.Router();

  /* =========================
     SAVE SETUP (AUTO SAVE)
  ========================= */

  router.post("/save", async (req, res) => {
    try {

      const {
        item_type,

        system_id,
        website_id,

        system_name,
        website_name,

        category,
        label,

        business_name,
        business_email,
        phone,

        brand_color,
        domain
      } = req.body;

      // 🔥 CHECK EXISTING SETUP
      const existing = await pool.query(
        `SELECT * FROM setups
         WHERE system_id = $1 OR website_id = $2`,
        [system_id, website_id]
      );

      if (existing.rows.length > 0) {

        await pool.query(
          `UPDATE setups SET

            item_type = $1,

            system_name = $2,
            website_name = $3,

            category = $4,
            label = $5,

            business_name = $6,
            business_email = $7,
            phone = $8,

            brand_color = $9,
            domain = $10,

            step = 1

          WHERE system_id = $11 OR website_id = $12`,

          [
            item_type,

            system_name,
            website_name,

            category,
            label,

            business_name,
            business_email,
            phone,

            brand_color,
            domain,

            system_id,
            website_id
          ]
        );

      } else {

        await pool.query(
          `INSERT INTO setups (

            item_type,

            system_id,
            website_id,

            system_name,
            website_name,

            category,
            label,

            business_name,
            business_email,
            phone,

            brand_color,
            domain,

            step,
            status

          )

          VALUES (

            $1,$2,$3,$4,$5,$6,$7,
            $8,$9,$10,$11,$12,
            $13,$14

          )`,

          [
            item_type,

            system_id,
            website_id,

            system_name,
            website_name,

            category,
            label,

            business_name,
            business_email,
            phone,

            brand_color,
            domain,

            1,
            "draft"
          ]
        );

      }

      res.json({
        success: true
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: "Setup save failed"
      });

    }
  });

  /* =========================
     LOAD SETUP
  ========================= */

  router.get("/load", async (req, res) => {
    try {

      const {
        system_id,
        website_id
      } = req.query;

      const result = await pool.query(
        `SELECT * FROM setups
         WHERE system_id = $1 OR website_id = $2`,
        [system_id, website_id]
      );

      if (result.rows.length === 0) {

        return res.json({
          found: false
        });

      }

      res.json({
        found: true,
        setup: result.rows[0]
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: "Load failed"
      });

    }
  });

  /* =========================
     LOAD ALL SETUPS
  ========================= */

  router.get("/load-all", async (req, res) => {
    try {

      const result = await pool.query(
        `SELECT * FROM setups
         ORDER BY id DESC`
      );

      res.json(result.rows);

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: "Failed to load setups"
      });

    }
  });


/* =========================
   GET SYSTEM LAUNCH FORM
========================= */

router.get("/form/system", async (req, res) => {

  try {

    res.json({
      success: true,
      form: systemLaunchForm
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to load system launch form"
    });

  }

});

/* =========================
   GET WEBSITE LAUNCH FORM
========================= */

router.get("/form/website", async (req, res) => {

  try {

    res.json({
      success: true,
      form: websitesLaunchForm
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to load website launch form"
    });

  }

});



  /* =========================
     SUBMIT SETUP
  ========================= */

  router.post(
    "/submit",
    upload.single("logo_file"),

    async (req, res) => {

      try {

        const logoPath = req.file
          ? `/uploads/${req.file.filename}`
          : null;

        const {

          item_type,

          system_id,
          website_id,

          system_name,
          website_name,

          category,
          label,

          business_name,
          business_email,
          phone,

          brand_color,
          domain

        } = req.body;

        const existing = await pool.query(
          `SELECT * FROM setups
           WHERE system_id = $1 OR website_id = $2`,
          [system_id, website_id]
        );

        if (existing.rows.length > 0) {

          const currentLogo = existing.rows[0].logo;

          await pool.query(
            `UPDATE setups SET

              item_type = $1,

              system_name = $2,
              website_name = $3,

              category = $4,
              label = $5,

              business_name = $6,
              business_email = $7,
              phone = $8,

              logo = $9,

              brand_color = $10,
              domain = $11,

              status = 'under_configuration',
              step = 1

             WHERE system_id = $12
             OR website_id = $13`,

            [

              item_type,

              system_name,
              website_name,

              category,
              label,

              business_name,
              business_email,
              phone,

              logoPath || currentLogo,

              brand_color,
              domain,

              system_id,
              website_id

            ]
          );

        } else {

          await pool.query(
            `INSERT INTO setups (

              item_type,

              system_id,
              website_id,

              system_name,
              website_name,

              category,
              label,

              business_name,
              business_email,
              phone,

              logo,

              brand_color,
              domain,

              status,
              step

            )

            VALUES (

              $1,$2,$3,$4,$5,$6,$7,
              $8,$9,$10,$11,$12,$13,
              $14,$15

            )`,

            [

              item_type,

              system_id,
              website_id,

              system_name,
              website_name,

              category,
              label,

              business_name,
              business_email,
              phone,

              logoPath,

              brand_color,
              domain,

              "under_configuration",
              1

            ]
          );

        }

        res.json({
          success: true,
          logo: logoPath
        });

      } catch (err) {

        console.error(err);

        res.status(500).json({
          success: false
        });

      }

    }
  );

  return router;
};
module.exports = setupRoutes;