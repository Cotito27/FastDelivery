const mysql = require('mysql2/promise');
const { config } = require('./config');

module.exports = {
  connect : async () => {
  const conn =  await mysql.createConnection(config);
  return conn;
  }
}