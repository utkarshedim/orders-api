// Recreates the tables and loads seed data.
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetDb() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'orders_demo',
    multipleStatements: true,
  });
  const schema = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');
  const seed = fs.readFileSync(path.join(__dirname, '../db/seed.sql'), 'utf8');
  await conn.query(schema);
  await conn.query(seed);
  await conn.end();
}

module.exports = { resetDb };

if (require.main === module) {
  resetDb()
    .then(() => console.log('Database reset with seed data.'))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
