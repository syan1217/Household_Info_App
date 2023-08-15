// connection.js

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'cs6400_sp23_team037'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected to the database.');
});

module.exports = connection;
