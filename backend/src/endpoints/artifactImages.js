const express = require('express');
const endpoint = express.Router();
const pool = require('../db');


//Delete an image to an artifact
endpoint.delete("/:artifactId/:pictureId", async (req, res) => {
    const { artifactId, pictureId } = req.params;
    try {
        const check = await pool.query('SELECT 1 FROM pictures WHERE pictureId = $1 AND artifactId = $2',[pictureId, artifactId]);

        if (check.rowCount === 0) {
            return res.status(404).json({ error: 'Picture not found' });
        }

        await pool.query('DELETE FROM pictures WHERE pictureId = $1 AND artifactId = $2',[pictureId, artifactId]);

        res.status(200).json({ message: 'Picture deleted successfully' });

    } catch (err) {
        console.error('DB ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});


module.exports = endpoint;