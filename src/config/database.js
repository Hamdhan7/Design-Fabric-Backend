

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10, // Adjust according to your requirements
    queueLimit: 0,
    Promise: require('bluebird'), // Ensure bluebird or another promise library is available

});

const promisePool = pool.promise();

module.exports = promisePool;
