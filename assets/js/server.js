const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// DB setup
const db = new sqlite3.Database('../data/users.db');
db.run(`CREATE TABLE IF NOT EXISTS users (
    username TEXT UNIQUE,
    password TEXT
)`);

// Register route
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password], function(err) {
        if (err) {
            return res.status(400).json({ error: "Username already exists." });
        }
        res.json({ message: "User registered successfully!" });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) return res.status(500).json({ error: "Server error" });
        if (!row) return res.status(401).json({ error: "Invalid credentials" });
        res.json({ message: "Login successful!" });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
