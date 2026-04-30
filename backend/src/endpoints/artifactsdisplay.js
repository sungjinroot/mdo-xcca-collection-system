const express = require('express');
const endpoint = express.Router();
const pool = require('../db');




//GET ALL ARTIFACT ( This is for main page), Pagination with Search

endpoint.get('/', async (req, res) => {
    try {
        const limit = Math.max(parseInt(req.query.limit, 10) || 30, 1);
        const lastID = parseInt(req.query.lastID, 10) || 0;
        const search = req.query.search || '';

        const result = await pool.query(
            `SELECT * FROM Artifacts
             WHERE artifactID > $1
             ORDER BY artifactID
             LIMIT $2`,
            [lastID, limit]
        );

        const rows = result.rows;
        const nextCursor = rows.length > 0
            ? rows[rows.length - 1].artifactID
            : null;

        res.status(200).json({
            data: rows,
            nextCursor: nextCursor
        });
  
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch artifacts" });
    }
  });



  module.exports = endpoint;