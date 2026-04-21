const createClientsTable = async (pool) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ clients table ready");
  } catch (err) {
    console.error("❌ clients table error:", err);
  }
};

module.exports = createClientsTable;