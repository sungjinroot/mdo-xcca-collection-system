const express = require('express');
const endpoint = express.Router();
const pool = require('../db');


// GET ARTIFACTS
endpoint.get('/', async (request, response) => {
    try {
        const result = await pool.query(`
            SELECT 
            a.artifactID,
            a.accessionNo,
        
            -- Names
            an.englishName,
            an.vernacularName,
        
            -- Provenance
            ap.ethnicGroup,
            ap.locality,
            ap.placeOfOrigin,
        
            -- Dimensions
            d.artifactLength,
            d.artifactWidth,
            d.artifactHeight,
            d.artifactDiameter
        
        FROM Artifacts a
        
        LEFT JOIN ArtifactNames an 
            ON a.artifactID = an.artifactID
        
        LEFT JOIN ArtifactProvenance ap 
            ON a.artifactID = ap.artifactID
        
        LEFT JOIN Dimensions d 
            ON a.artifactID = d.artifactID;
           
            `);

        response.json(result.rows);

    } catch (err) {
        console.error(err);
        response.status(500).json({ error: "Failed to fetch artifacts" })
    }
});


// ADD

endpoint.get('/new',(request,response) => {
    response.send("Adding")
});

module.exports = endpoint;