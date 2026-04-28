const express = require('express');
const endpoint = express.Router();
const pool = require('../db');




//GET STATISTICS ( This is for main page)

endpoint.get('/', async (req, res) => {
    try {
       const statisticsQuery = `
       SELECT
            r.roomID,
            r.roomName,
            COUNT(a.artifactID) AS totalArtifact
        FROM Rooms r
        LEFT JOIN Artifacts a ON r.roomID = a.roomID
        GROUP BY r.roomID, r.roomName
        ORDER BY r.roomID;`
        

            ;

        const result = await pool.query(statisticsQuery);

        

       res.status(200).json(result.rows); 
  
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch artifacts" });
    }
  });


  module.exports = endpoint;