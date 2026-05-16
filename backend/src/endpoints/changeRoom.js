const express = require('express');
const endpoint = express.Router();
const pool = require('../db');


endpoint.put("/:artifactId/:roomId", async (req,res) => {
    const roomId = req.params.roomId;
    const artifactId = req.params.artifactId;
    
    try {
        const result = await pool.query("UPDATE Artifacts SET roomId = $1 WHERE artifactId = $2",[roomId,artifactId]);
        res.json({
            message: "Artifact Room Updated!"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});




module.exports = endpoint;