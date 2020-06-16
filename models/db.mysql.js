'use strict';

const mysql = require('mysql');
require("dotenv").config();

const db = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'chess_db',
    port: 3306
});

module.exports = db;