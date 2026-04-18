const express = require('express');
const endpoint = express.Router();
const pool = require('../db')




// GET ALL ROOM
endpoint.get("/", async (req, res) => {
    try {

        const result = await pool.query(
            "SELECT * FROM Rooms ",
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Room does not exists"})
    }
});




module.exports = endpoint;