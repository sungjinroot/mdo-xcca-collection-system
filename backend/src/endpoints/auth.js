const express = require('express');
const endpoint = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// LOGIN
endpoint.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const result = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.bcryptpassword);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Determine role based on permissions
        let role = 'guest';
        if (user.canadd) {
            role = 'assistant';
        }

        const token = jwt.sign(
            { 
                userID: user.userid, 
                username: user.username,
                role: role,
                canAdd: user.canadd,
            },
            process.env.JWT_SECRET || "secretkey",
            { expiresIn: "120d" }
        );

        res.status(200).json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = endpoint;