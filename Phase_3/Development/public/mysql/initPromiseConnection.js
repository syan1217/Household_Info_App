// promiseConnection.js

const mysqlPromise = require('mysql2/promise');

const config = {
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'cs6400_sp23_team037',
};

const initPromiseConnection = async function() {
  try {
    const promiseConnection = await mysqlPromise.createConnection(config);
    console.log('Promise connection established.');
    return promiseConnection;
  } catch (err) {
    console.error('Error creating promise connection:', err);
  }
};

module.exports = {
  initPromiseConnection
};
