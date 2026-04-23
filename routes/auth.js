const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function authRoutes(pool) {
  const router = express.Router();

  /* =========================
     AUTH LOGIN
  ========================= */
  router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      const result = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({
          error: "User not found"
        });
      }

      const user = result.rows[0];

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({
          error: "Invalid password"
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username
        }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Login failed"
      });
    }
  });

  return router;
}

module.exports = authRoutes;