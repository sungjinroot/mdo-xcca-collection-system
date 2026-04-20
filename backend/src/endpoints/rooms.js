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

endpoint.put("/", async (req, res) => {
    const roomId = req.params.id;
    const { roomName, roomPictureUrl, title, caption } = req.body;

    // Check if room exists first
    try {
        const checkRoom = await pool.query(
            "SELECT * FROM Rooms WHERE roomID = $1",
            [roomId]
        );

        if (checkRoom.rows.length === 0) {
            return res.status(404).json({ error: "Room not found" });
        }

        // Update the room
        const updateRoom = await pool.query(
            'UPDATE Rooms, SET roomName = $1, roomPictureUrl = $2, title = $3, caption = $4, WHERE roomID = $5, RETURNING *',
            [roomName, roomPictureUrl, title, caption, roomId]
        );

        res.json({
            message: "Room updated",
            room: updateRoom.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update room" });
    }
});

module.exports = endpoint;