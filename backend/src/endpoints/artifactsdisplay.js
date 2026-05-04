const express = require('express');
const endpoint = express.Router();
const pool = require('../db');

endpoint.get('/:roomID?', async (req, res) => {
    const roomID = req.params.roomID ? parseInt(req.params.roomID, 10) : null;

    try {
        let result;

        if (roomID !== null && !isNaN(roomID)) {
            result = await pool.query(
                `SELECT a.artifactID, a.accessionNo, an.englishName, an.vernacularName
                 FROM Artifacts a
                 LEFT JOIN ArtifactNames an ON a.artifactID = an.artifactID
                 WHERE a.roomID = $1`,
                [roomID]
            );
        } else {
            result = await pool.query(
                `SELECT a.artifactID, a.accessionNo, an.englishName, an.vernacularName
                 FROM Artifacts a
                 LEFT JOIN ArtifactNames an ON a.artifactID = an.artifactID`
            );
        }

        res.json(result.rows);

    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});