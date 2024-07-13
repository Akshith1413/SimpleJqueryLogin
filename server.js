const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const db = new sqlite3.Database(':memory:');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, phone TEXT, email TEXT)");
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/register', (req, res) => {
    const { username, password, phone, email } = req.body;
    db.run("INSERT INTO users (username, password, phone, email) VALUES (?, ?, ?, ?)", [username, password, phone, email], function(err) {
        if (err) {
            res.status(500).send("Error registering user");
        } else {
            res.send("User registered successfully");
        }
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
        if (err) {
            res.status(500).send("Error logging in");
        } else if (row) {
            res.send("Login successful");
        } else {
            res.status(400).send("Invalid credentials");
        }
    });
});

app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    res.send("Contact form submitted");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
