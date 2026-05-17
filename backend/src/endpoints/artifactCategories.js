const express = require ("express");
const endpoint = express.Router();
const pool = require('../db');


endpoint.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT c.categoryid, c.categoryname, ac.artifactid FROM categories c LEFT JOIN artifactcategories ac ON c.categoryid = ac.categoryid AND ac.artifactid = $1 ORDER BY c.categoryid;', [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch room' });
    }
});


module.exports = endpoint;
