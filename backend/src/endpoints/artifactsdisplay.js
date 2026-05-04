const express = require('express');
const endpoint = express.Router();
const pool = require('../db');

endpoint.get('/:roomID?', async (req, res) => {
    const { roomID } = req.params;

    const roomArtifactsQuery = {
        get_RoomID_Artifacts: `
            SELECT 
                a.artifactID,
                a.accessionNo,
                an.englishName,
                an.vernacularName
            FROM Artifacts a
            LEFT JOIN ArtifactNames an ON a.artifactID = an.artifactID
            WHERE a.roomID = $1
        `,
        get_all_Artifacts: `
            SELECT 
                a.artifactID,
                a.accessionNo,
                an.englishName,
                an.vernacularName
            FROM Artifacts a
            LEFT JOIN ArtifactNames an ON a.artifactID = an.artifactID
        `
    };

    try {
        let result;

        if (roomID) {
            result = await pool.query(
                roomArtifactsQuery.get_RoomID_Artifacts,
                [roomID]
            );
        } else {
            result = await pool.query(
                roomArtifactsQuery.get_all_Artifacts
            );
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No artifacts found.' });
        }

        res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = endpoint;