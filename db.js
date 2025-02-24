const mysql = require("mysql2");
require("dotenv").config(); // Load environment variables from a .env file

const connection = mysql.createConnection({
    host: localhost,
    user: root,
    password: @*Dec2001,
    database: gap,
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL: " + err.stack);
        return;
    }
    console.log("Connected to MySQL as id: " + connection.threadId);
});

module.exports = connection;
