const mysql = require('mysql2');
require('dotenv').config();

// Use a Pool for better performance and connection management
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promisify for async/await usage
const promisePool = pool.promise();

pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.code);
        console.error('   Please check your .env file and ensure MySQL is running.');
    } else {
        console.log('✅ Connected to MySQL Database successfully.');
        connection.release();
    }
});

module.exports = promisePool;