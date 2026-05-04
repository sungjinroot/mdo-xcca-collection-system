const express = require('express');
const endpoint = express.Router();
const pool = require('../db');

endpoint.get('/:roomID?', async (req, res) => {
    const roomID = req.params.roomID ? parseInt(req.params.roomID, 10) : null;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = 8;
    const offset = (page - 1) * limit;

    try {
        let result;

        if (roomID !== null && !isNaN(roomID)) {
            result = await pool.query(
                `SELECT a.artifactID, a.accessionNo, an.englishName, an.vernacularName
                 FROM Artifacts a
                 LEFT JOIN ArtifactNames an ON a.artifactID = an.artifactID
                 WHERE a.roomID = $1,
                 ORDER BY a.artifactID
                 LIMIT $2 OFFSET $3`,
                [roomID, limit, offset]
            );
        } else {    
            result = await pool.query(
                `SELECT a.artifactID, a.accessionNo, an.englishName, an.vernacularName
                 FROM Artifacts a
                 LEFT JOIN ArtifactNames an ON a.artifactID = an.artifactID
                 ORDER BY a.artifactID
                 LIMIT $1 OFFSET $2`,
                [limit, offset]
            );
        }

        res.json(result.rows);

    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});