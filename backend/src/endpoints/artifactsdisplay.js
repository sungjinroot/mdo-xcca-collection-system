const express = require('express');
const endpoint = express.Router();
const pool = require('../db');




//GET ALL ARTIFACT ( This is for main page)

endpoint.get('/', async (req, res) => {
    try {


        query.skip(10).limit(10)

        
       const result = await pool.query(artifactQueries.all);
  
       res.status(200).json(result.rows); 
  
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch artifacts" });
    }
  });

// DELETE ARTIFACT
endpoint.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM Artifacts WHERE artifactID = $1",
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Artifact not found" });
        }
        res.status(200).json({ message: "Artifact deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

  module.exports = endpoint;