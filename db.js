require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false // Required for Render's PostgreSQL
    }
});

pool.connect((err) => {
    if (err) {
        console.error("Error connecting to PostgreSQL: " + err.stack);
        return;
    }
    console.log("Connected to PostgreSQL");
});

module.exports = pool;