const express = require('express');
const endpoint = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// GET ALL USERS
endpoint.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Users does not exist" });
    }
});


// POST USERS


endpoint.post('/', async (req, res) => {
  const { username, bcryptPassword } = req.body;

  if (!username || !bcryptPassword) {
    return res.status(400).json({ error: 'username and bcryptPassword are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO Users (username, bcryptPassword)
       VALUES ($1, $2)
       RETURNING *`,
      [username, bcryptPassword]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error('DB ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});


// DELETE USER
endpoint.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM users WHERE userID = $1",
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = endpoint;