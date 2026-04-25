const express = require ("express");
const endpoint = express.Router();
const pool = require('../db');

//GET ALL CATEGORIES

endpoint.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM categories ",
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Category does not exists"})
    }
});

module.exports = endpoint;