// db.js  (CommonJS)
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Railway la inyecta
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;

