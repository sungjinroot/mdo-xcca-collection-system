const express = require('express');
const endpoint = express.Router();
const pool = require('../db')

// GET ALL ROOM
endpoint.get("/", async (req, res) => {
    try {
        console.log()
        const result = await pool.query(
            "SELECT * FROM Rooms ",
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Room does not exists"})
    }
});

// POST ROOM
endpoint.post('/', async (req, res) => {
  const {roomName, roomPictureURL, title, caption} = req.body

  if (!roomName || !title) {
    return res.status(400).json({ error: 'roomName and title are required' })
  }

  try {
    const result = await pool.query(
      'INSERT INTO rooms (roomName, roomPictureURL, title, caption) VALUES ($1, $2, $3, $4) RETURNING *',
      [roomName, roomPictureURL, title, caption]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('DB ERROR:', err)
    res.status(500).json({ error: err.message })
  }
})

module.exports = endpoint;