const express = require('express');
const endpoint = express.Router();
const pool = require('../db')



endpoint.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM Rooms WHERE roomID = $1",
            [id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Room does not exists"})
    }
});


module.exports = endpoint;