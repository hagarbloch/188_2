const mysql = require('mysql2');
const config = require('./DB.config');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: config.HOST,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DB
});

connection.connect((err) => {
  if (err) throw error;
  console.log("connected to DB");
});

module.exports = connection;

