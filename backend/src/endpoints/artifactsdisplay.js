const express = require('express');
const endpoint = express.Router();
const pool = require('../db');
const { parseRoomId, roomExists } = require('../utils/roomValidation');

endpoint.get('/', async (req, res) => {

  try {
    const roomID = parseRoomId(req.query.roomID);
    if (roomID === null) {
      return res.status(400).json({
        error: 'roomID is required (query) and must be a positive integer',
      });
    }

    if (!(await roomExists(pool, roomID))) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const limit = Math.max(parseInt(req.query.limit, 10) || 30, 1);
    const lastID = parseInt(req.query.lastID, 10) || 0;

    const searchTerm =
      typeof req.query.search === 'string' ? req.query.search.trim() : '';

    let query;
    let values;

    if (!searchTerm) {
      query = `
        SELECT *
        FROM Artifacts
        WHERE artifactID > $1
          AND roomID = $2
        ORDER BY artifactID
        LIMIT $3
      `;
      values = [lastID, roomID, limit];
    } else {
      query = `
        SELECT a.*
        FROM Artifacts a
        LEFT JOIN ArtifactNames an ON a.artifactID = an.artifactID
        WHERE a.artifactID > $1
          AND a.roomID = $4
          AND (
            an.englishName ILIKE '%' || $3 || '%'
            OR an.vernacularName ILIKE '%' || $3 || '%'
          )
        ORDER BY a.artifactID
        LIMIT $2
      `;
      values = [lastID, limit, searchTerm, roomID];
    }

    const result = await pool.query(query, values);

    const rows = result.rows;
    const nextCursor =
      rows.length > 0 ? rows[rows.length - 1].artifactID : null;

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
