const express = require('express');
const endpoint = express.Router();
const pool = require('../db');

endpoint.get('/', async (req, res) => {

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
 
    // Search
    const search = req.query.search ? `%${req.query.search}%` : null;
 
    // Room filter
    const roomID = req.query.roomID ? parseInt(req.query.roomID, 10) : null;
 
    // Category Filter
    const categoryID = req.query.categoryID ? parseInt(req.query.categoryID, 10) : null;
 
    try {
        const conditions = [];
        const params = [];
 
        // IF ?search
        if (search) {
            conditions.push(`(an.englishName ILIKE $${params.length + 1} OR an.vernacularName ILIKE $${params.length + 1} OR a.accessionNo ILIKE $${params.length + 1})`);
            params.push(search);
        }
 
        // IF ?roomID
        if (roomID) {
            conditions.push(`a.roomID = $${params.length + 1}`);
            params.push(roomID);
        }
 
        // IF ?categoryID
        if (categoryID) {
            conditions.push(`EXISTS (
                SELECT 1 FROM ArtifactCategories ac
                WHERE ac.artifactID = a.artifactID AND ac.categoryID = $${params.length + 1}
            )`);
            params.push(categoryID);
        }
 
        
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
 
        const baseQuery = `
            FROM Artifacts a
            LEFT JOIN ArtifactNames an ON a.artifactID = an.artifactID
            LEFT JOIN Rooms r ON a.roomID = r.roomID
            ${whereClause}
        `;
 
        const countResult = await pool.query(`SELECT COUNT(DISTINCT a.artifactID) ${baseQuery}`, params);
        const totalRows = parseInt(countResult.rows[0].count, 10);
        const totalPages = Math.ceil(totalRows / limit);
 
        const artifactResult = await pool.query(`
            SELECT DISTINCT
                a.artifactID,
                a.accessionNo,
                a.roomID,
                r.roomName,
                an.englishName,
                an.vernacularName
            ${baseQuery}
            ORDER BY a.artifactID ASC
            LIMIT $${params.length + 1} OFFSET $${params.length + 2}
        `, [...params, limit, offset]);
 
        res.status(200).json({
            data: artifactResult.rows,
            pagination: {
                currentPage: page,
                totalPages,
                totalRows,
                limit
            }
        });
 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
 
module.exports = endpoint;
 

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

module.exports = endpoint;
