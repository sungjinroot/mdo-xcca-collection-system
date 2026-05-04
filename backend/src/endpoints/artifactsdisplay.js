const express = require('express');
const endpoint = express.Router();
const pool = require('../db');



endpoint.get('/:roomID', async (req, res) => {
    const { roomID } = req.params;

    const roomArtifactsQuery = {
        all: `
            SELECT 
                a.artifactID,
                a.accessionNo,
                an.englishName,
                an.vernacularName
            FROM Artifacts a
            LEFT JOIN ArtifactNames an ON a.artifactID = an.artifactID
            WHERE a.roomID = :roomID
        `
    };

    try {
        const result = await db.query(roomArtifactsQuery.all, { roomID });
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No artifacts found in this room.' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = endpoint;
