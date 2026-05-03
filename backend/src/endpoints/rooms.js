const express = require('express');
const endpoint = express.Router();
const pool = require('../db')

// GET ALL ROOMS 
endpoint.get("/", async (req, res) => {
    try {
        const limitRaw = req.query.limit;
        const offsetRaw = req.query.offset;

        let result;
        if (limitRaw === undefined && offsetRaw === undefined) {
            result = await pool.query('SELECT * FROM Rooms ORDER BY roomID');
        } else {
            const limit = Math.min(Math.max(parseInt(limitRaw, 10) || 50, 1), 200);
            const offset = Math.max(parseInt(offsetRaw, 10) || 0, 0);
            result = await pool.query(
                'SELECT * FROM Rooms ORDER BY roomID LIMIT $1 OFFSET $2',
                [limit, offset]
            );
        }
        res.json(result.rows);
    } catch (err) {
        console.error('DB ERROR:', err);
        res.status(500).json({ error: 'Database error' })
    }
});

// GET ONE ROOM 
endpoint.get('/:id', async (req, res) => {
    const roomId = req.params.id;
    try {
        const room = await pool.query(
            `SELECT r.*,
              (SELECT COUNT(*)::int FROM Artifacts a WHERE a.roomID = r.roomID) AS artifact_count
             FROM Rooms r
             WHERE r.roomID = $1`,
            [roomId]
        );
        if (room.rows.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.json(room.rows[0]);
    } catch (err) {
        console.error('DB ERROR:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST ROOM
endpoint.post('/', async (req, res) => {
    const { roomName, roomPictureURL, title, caption } = req.body
    if (!roomName || !title || !roomPictureURL) {
        return res.status(400).json({ error: 'roomName, title, roomPictureURL are required' })
    }
    try {
        const result = await pool.query(
            'INSERT INTO Rooms (roomName, roomPictureURL, title, caption) VALUES ($1, $2, $3, $4) RETURNING *',
            [roomName, roomPictureURL, title, caption ?? null]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error('DB ERROR:', err)
        res.status(500).json({ error: err.message })
    }
})

// PUT ROOM
endpoint.put("/:id", async (req, res) => {
    const roomId = req.params.id;
    const { roomName, title, caption } = req.body;
    const roomPictureURL = req.body.roomPictureURL ?? req.body.roomPictureUrl;
    try {
        const checkRoom = await pool.query(
            "SELECT * FROM Rooms WHERE roomID = $1",
            [roomId]
        );
        if (checkRoom.rows.length === 0) {
            return res.status(404).json({ error: "Room not found" });
        }
        const updateRoom = await pool.query(
            'UPDATE Rooms SET roomName = $1, roomPictureURL = $2, title = $3, caption = $4 WHERE roomID = $5 RETURNING *',
            [roomName, roomPictureURL, title, caption, roomId]
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

// DELETE ROOM
endpoint.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const occupied = await pool.query(
            'SELECT 1 FROM Artifacts WHERE roomID = $1 LIMIT 1',
            [id]
        );
        if (occupied.rows.length > 0) {
            return res.status(409).json({
                error: 'Room cannot be deleted while it contains artifacts'
            });
        }
        const result = await pool.query(
            `DELETE FROM Rooms WHERE roomID = $1`,
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.status(200).json({ message: 'Room deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = endpoint;
