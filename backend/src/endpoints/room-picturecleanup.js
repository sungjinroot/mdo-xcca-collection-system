const express = require('express');
const endpoint = express.Router();
const pool = require('../db');
const fs = require('fs').promises;
const path = require('path');

endpoint.delete("/roomthumbnail/:id", async (req, res) => {
    const roomId = req.params.id;

    try {
        const result = await pool.query(
            'SELECT roomPictureURL FROM Rooms WHERE roomID = $1',
            [roomId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }

        const pictureUrl = result.rows[0].roompictureurl;

        if (!pictureUrl) {
            return res.status(400).json({ error: 'Room has no existing picture to delete' });
        }

        const relativePath = pictureUrl.replace(/^https?:\/\/[^\/]+/, '');
        const filePath = path.join('/app', relativePath);

        try {
            await fs.unlink(filePath);
        } catch (fileErr) {
            console.warn(`Could not delete file: ${filePath} - ${fileErr.message}`);
        }

        await pool.query('UPDATE Rooms SET roomPictureURL = NULL WHERE roomID = $1', [roomId]);

        res.status(200).json({ message: 'Room picture deleted successfully' });

    } catch (err) {
        console.error('Failed to delete room picture:', err);
        res.status(500).json({ error: 'Failed to delete room picture' });
    }
});

module.exports = endpoint;