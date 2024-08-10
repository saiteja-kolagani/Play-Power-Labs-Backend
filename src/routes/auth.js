
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models/database');


router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT username FROM users WHERE username = ?', [username], (err, row) => {
        if (row) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ error: 'Error hashing password' });
            }

            db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Error registering user' });
                }

                const token = jwt.sign({ id: this.lastID }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.status(201).json({ token });
            });
        });
    });
});


router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching user' });
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.json({ token });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        });
    });
});

module.exports = router;