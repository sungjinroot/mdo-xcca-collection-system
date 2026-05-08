const express = require('express');
const endpoint = express.Router();
const pool = require('../db');

const getArtifactsDisplay = async (req, res) => {
    const roomID = req.params.roomID ? parseInt(req.params.roomID, 10) : null;


    const page = parseInt(req.query.page, 10) || 1;
    const limit = 8;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';


    try {
        let result;

        if (roomID !== null && !isNaN(roomID)) {
            result = await pool.query(
                `SELECT
                 a.artifactID, 
                 an.englishName,
                 an.vernacularName
                 FROM Artifacts a
                 LEFT JOIN ArtifactNames an ON a.artifactID = an.artifactID
                 WHERE a.roomID = $1
                    AND (an.englishName ILIKE $4
                        OR an.vernacularNAME ILIKE $4 OR
                        a.accessionNo::text ILIKE $4
                        )
                ORDER BY an.englishName ASC
                
                 LIMIT $2 OFFSET $3`,
            
                 
                [roomID, limit, offset, `%${search}%`]
            );
        } else {    
            result = await pool.query(

                `SELECT 
                 a.artifactID, 
                 an.englishName, 
                 an.vernacularName
                 FROM Artifacts a
                 LEFT JOIN ArtifactNames an ON a.artifactID = an.artifactID
                 WHERE
                 an.englishName ILIKE $3
                 OR an.vernacularName ILIKE $3
                 OR a.accessionNo::text ILIKE $3
                 ORDER BY an.englishName ASC
                 LIMIT $1 OFFSET $2`,
                [limit, offset, `%${search}%`]
            );
        }

        res.json(result.rows);

    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

endpoint.get('/', getArtifactsDisplay);
endpoint.get('/:roomID', getArtifactsDisplay);

module.exports = endpoint;