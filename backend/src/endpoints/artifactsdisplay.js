const express = require('express');
const endpoint = express.Router();
const pool = require('../db');




endpoint.get('/', async (req, res) => {
    try {
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 30, 1), 100);
        const lastID = parseInt(req.query.lastID, 10) || 0;
        const search = (req.query.search || '').trim();
        const roomIDRaw = req.query.roomID;

        let roomID = undefined;
        if (roomIDRaw !== undefined && String(roomIDRaw).trim() !== '') {
            roomID = parseInt(roomIDRaw, 10);
            if (Number.isNaN(roomID)) {
                return res.status(400).json({ error: 'Invalid roomID' });
            }
        }

        let query;
        let values;

        if (!search) {
            if (roomID === undefined) {
                query =
                    `SELECT artifactID, roomID FROM Artifacts
                    WHERE artifactID > $1
                     ORDER BY artifactID
                     LIMIT $2`;
                values = [lastID, limit];
            } else {
                query =
                    `SELECT artifactID, roomID FROM Artifacts
                    WHERE artifactID > $1 AND roomID = $3
                     ORDER BY artifactID
                     LIMIT $2`;
                values = [lastID, limit, roomID];
            }
        } else {
            if (roomID === undefined) {
                return res.status(400).json({
                    error:
                        'roomID is required. Artifact must be stored in a certain room'
                });
            }
            query = `
              SELECT a.artifactID, a.roomID
              FROM Artifacts a
              WHERE a.artifactID > $1
                AND a.roomID = $4
                AND (
                  EXISTS (
                    SELECT 1 FROM ArtifactNames an
                    WHERE an.artifactID = a.artifactID
                      AND (
                        an.englishName ILIKE '%' || $3 || '%'
                        OR an.vernacularName ILIKE '%' || $3 || '%'
                      )
                  )
                  OR EXISTS (
                    SELECT 1 FROM ArtifactCategories acat
                    INNER JOIN Categories cat ON acat.categoryID = cat.categoryID
                    WHERE acat.artifactID = a.artifactID
                      AND cat.categoryName ILIKE '%' || $3 || '%'
                  )
                )
              ORDER BY a.artifactID
              LIMIT $2
            `;
            values = [lastID, limit, search, roomID];
        }

        const result = await pool.query(query, values);

        const rows = result.rows;
        const nextCursor = rows.length > 0 ? rows[rows.length - 1].artifactid : null;

        res.status(200).json({
            data: rows,
            nextCursor,
            ...(roomID !== undefined ? { roomID } : {}),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch artifacts' });
    }
});


module.exports = endpoint;
