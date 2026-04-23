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

  /* =========================
     AUTH REGISTER
  ========================= */
  router.post("/register", async (req, res) => {
    try {
      const { username, password } = req.body;

      const existing = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );

      if (existing.rows.length > 0) {
        return res.status(400).json({
          error: "User already exists"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        "INSERT INTO users (username, password) VALUES ($1, $2)",
        [username, hashedPassword]
      );

      res.json({
        message: "User registered successfully"
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Registration failed"
      });
    }
  });

  return router;
}

module.exports = authRoutes;