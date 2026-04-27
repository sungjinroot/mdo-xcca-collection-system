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


endpoint.post('/', async (req, res) => {
    const {
        accessionNo, catalogueNo, roomID,
        englishName, vernacularName,
        ethnicGroup, locality, placeOfOrigin,
        contactPersonFullName, dateCollectedByContactPerson, receiverFullName, receivedByReceiverDate, recordedBy,
        artifactDetails, artifactFunction, conditionUponReceipt, specialRemarks,
        collectionType, price,
        artifactLength, artifactWidth, artifactHeight, artifactDiameter,
        categoryID,
        angleName, pictureFilePath, isProfilePicture
    } = req.body;
 
    if (
        !accessionNo || !catalogueNo || !roomID ||
        !contactPersonFullName || !dateCollectedByContactPerson ||
        !receiverFullName || !receivedByReceiverDate || !recordedBy ||
        !collectionType || !categoryID
    ) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
 
    try {
        const artifactResult = await pool.query(
            'INSERT INTO Artifacts (accessionNo, catalogueNo, roomID) VALUES ($1, $2, $3) RETURNING artifactID',
            [accessionNo, catalogueNo, roomID]
        );
        const artifactID = artifactResult.rows[0].artifactid;
 
        await pool.query(
            'INSERT INTO ArtifactNames (artifactID, englishName, vernacularName) VALUES ($1, $2, $3)',
            [artifactID, englishName, vernacularName]
        );
 
        await pool.query(
            'INSERT INTO ArtifactProvenance (artifactID, ethnicGroup, locality, placeOfOrigin) VALUES ($1, $2, $3, $4)',
            [artifactID, ethnicGroup, locality, placeOfOrigin]
        );
 
        await pool.query(
            'INSERT INTO ContactPersons (artifactID, contactPersonFullName, dateCollectedByContactPerson, receiverFullName, receivedByReceiverDate, recordedBy) VALUES ($1, $2, $3, $4, $5, $6)',
            [artifactID, contactPersonFullName, dateCollectedByContactPerson, receiverFullName, receivedByReceiverDate, recordedBy]
        );
 
        await pool.query(
            'INSERT INTO PhysicalDescription (artifactID, artifactDetails, artifactFunction, conditionUponReceipt, specialRemarks) VALUES ($1, $2, $3, $4, $5)',
            [artifactID, artifactDetails, artifactFunction, conditionUponReceipt, specialRemarks]
        );
 
        await pool.query(
            'INSERT INTO Acquisition (artifactID, collectionType, price) VALUES ($1, $2, $3)',
            [artifactID, collectionType, price]
        );
 
        await pool.query(
            'INSERT INTO Dimensions (artifactID, artifactLength, artifactWidth, artifactHeight, artifactDiameter) VALUES ($1, $2, $3, $4, $5)',
            [artifactID, artifactLength, artifactWidth, artifactHeight, artifactDiameter]
        );
 
        await pool.query(
            'INSERT INTO ArtifactCategories (artifactID, categoryID) VALUES ($1, $2)',
            [artifactID, categoryID]
        );
 
        await pool.query(
            'INSERT INTO Pictures (artifactID, angleName, pictureFilePath, isProfilePicture) VALUES ($1, $2, $3, $4)',
            [artifactID, angleName, pictureFilePath, isProfilePicture]
        );
 
        res.status(201).json({ message: 'Artifact created successfully', artifactID });
 
    } catch (err) {
        console.error('DB ERROR:', err);
        res.status(500).json({ error: err.message });
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