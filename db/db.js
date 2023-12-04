let mysql = require('mysql2');

let conn = mysql.createConnection({
    user:"root",
    password:"23946596",
    database:"sistema_agendamento",
    host:"localhost",
});

module.exports = conn;