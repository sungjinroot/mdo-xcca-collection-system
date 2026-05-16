const express = require('express');
const endpoint = express.Router();
const pool = require('../db');

endpoint.get("/:id", async (req,res) => {
    const artifactId = req.params.id;

    try {
        const result = await pool.query('SELECT * FROM pictures WHERE artifactId = $1 ORDER BY isprofilepicture DESC;;', [artifactId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Thumbnail not found' });
        }

        res.status(200).json(result.rows);

    }   catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get artifact pictures' });
    }
});

endpoint.put("/:artifactId/:pictureId", async (req, res) => {
    try {
        const artifactId = req.params.artifactId;
        const pictureId = req.params.pictureId;

        // Set all pictures for this artifact to false
        await pool.query('UPDATE pictures SET isprofilepicture = false WHERE artifactId = $1',[artifactId]);

        // Set selected picture to true
        await pool.query('UPDATE pictures SET isprofilepicture = true WHERE pictureId = $1',[pictureId]);
        
        res.status(200).json({
            message: "Profile picture updated"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Server error"
        });
    }
});






module.exports = endpoint;