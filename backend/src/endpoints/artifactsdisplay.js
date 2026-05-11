const express = require('express');
const endpoint = express.Router();
const pool = require('../db');

const getArtifactsDisplay = async (req, res) => {
    const roomID = req.params.roomID ? parseInt(req.params.roomID, 10) : null;
    const categoryID = req.query.categoryID ? parseInt(req.query.categoryID, 10) : null;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    const search = req.query.search ? `%${req.query.search}%` : '%';

    try {
        let artifactQuery = `
            SELECT 
                a.artifactID,
                an.englishName,
                an.vernacularName,
                a.roomID AS currentRoomID,
                r.roomName AS currentRoomName
            FROM Artifacts a
            LEFT JOIN ArtifactNames an ON a.artifactID = an.artifactID
            LEFT JOIN Rooms r ON a.roomID = r.roomID
            WHERE (
                an.englishName ILIKE $1
                OR an.vernacularName ILIKE $1
                OR a.accessionNo::text ILIKE $1
            )
        `;

        const params = [search];

        // category filter by PRIMARY KEY (not name)
        if (categoryID !== null && !isNaN(categoryID)) {
            artifactQuery += ` AND a.categoryID = $${params.length + 1}`;
            params.push(categoryID);
        }

        artifactQuery += `
            ORDER BY an.englishName ASC
            LIMIT $${params.length + 1}
            OFFSET $${params.length + 2}
        `;

        params.push(limit, offset);

        const result = await pool.query(artifactQuery, params);

        let roomsResult;

        if (roomID !== null && !isNaN(roomID)) {
            roomsResult = await pool.query(
                `SELECT roomID, roomName
                 FROM Rooms
                 WHERE roomID != $1
                 ORDER BY roomName ASC`,
                [roomID]
            );
        } else {
            roomsResult = await pool.query(
                `SELECT roomID, roomName
                 FROM Rooms
                 ORDER BY roomName ASC`
            );
        }

        const countResult = await pool.query(
            `
            SELECT COUNT(*) 
            FROM Artifacts a
            LEFT JOIN ArtifactNames an ON a.artifactID = an.artifactID
            WHERE (
                an.englishName ILIKE $1
                OR an.vernacularName ILIKE $1
                OR a.accessionNo::text ILIKE $1
            )
            ${categoryID ? "AND a.categoryID = $2" : ""}
            `,
            categoryID ? [search, categoryID] : [search]
        );

        const totalRows = parseInt(countResult.rows[0].count, 10);
        const totalPages = Math.ceil(totalRows / limit);

        return res.json({
            data: result.rows,
            rooms: roomsResult.rows, 
            pagination: {
                currentPage: page,
                totalPages,
                totalRows,
                limit
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/*
const getRoomProfilePicture = async (req, res  ) => {
    const roomIDProfilepicture = req.params.roomID ? parseInt(req.params.roomID, 10) : null;


    try {
        let result;


        if (roomID != null && !NaN(roomID)){
            result = await.pool.query(
                'SELECT 
                pool.PictureID,
                p.angleName,
                p.pictureFilePath,
                p.artifactID
                FROM Picture p
                JOIN Artifacts a ON p.artifactID = a'
            )


        }

    }
  
};
*/

endpoint.get('/', getArtifactsDisplay);
endpoint.get('/:roomID', getArtifactsDisplay);

module.exports = endpoint;