const express = require('express');
const endpoint = express.Router();
const pool = require('../db');

//ARTIFACTS SQL FOR GET API

const artifactQueries = {

  all: `
    SELECT 
      a.artifactID,
      a.accessionNo,
      a.catalogueNo,
      a.roomID,
      a.storageLocation,

      an.englishName,
      an.vernacularName,

      ap.ethnicGroup,
      ap.locality,
      ap.placeOfOrigin,

      cp.contactPersonFullName,
      cp.dateCollectedByContactPerson,
      cp.receiverFullName,
      cp.receivedByReceiverDate,
      cp.recordedBy,

      d.artifactLength,
      d.artifactWidth,
      d.artifactHeight,
      d.artifactDiameter,

      pd.artifactDetails,
      pd.artifactFunction,
      pd.conditionUponReceipt,
      pd.specialRemarks,

      ac.collectionType,
      ac.price

    FROM Artifacts a

    LEFT JOIN ArtifactNames an 
      ON a.artifactID = an.artifactID

    LEFT JOIN ArtifactProvenance ap 
      ON a.artifactID = ap.artifactID

    LEFT JOIN ContactPersons cp
      ON a.artifactID = cp.artifactID

    LEFT JOIN Dimensions d 
      ON a.artifactID = d.artifactID

    LEFT JOIN PhysicalDescription pd
      ON a.artifactID = pd.artifactID

    LEFT JOIN Acquisition ac
      ON a.artifactID = ac.artifactID
  `,

  physical: `
    SELECT 
      a.artifactID,
      a.accessionNo,

      d.artifactLength,
      d.artifactWidth,
      d.artifactHeight,
      d.artifactDiameter,

      pd.artifactDetails,
      pd.artifactFunction,
      pd.conditionUponReceipt,
      pd.specialRemarks

    FROM Artifacts a

    LEFT JOIN Dimensions d
      ON a.artifactID = d.artifactID

    LEFT JOIN PhysicalDescription pd
      ON a.artifactID = pd.artifactID
  `,

  names: `
    SELECT 
      a.artifactID,
      a.accessionNo,

      an.englishName,
      an.vernacularName

    FROM Artifacts a

    LEFT JOIN ArtifactNames an 
      ON a.artifactID = an.artifactID
  `,

  provenance: `
    SELECT 
      a.artifactID,
      a.accessionNo,

      ap.ethnicGroup,
      ap.locality,
      ap.placeOfOrigin

    FROM Artifacts a

    LEFT JOIN ArtifactProvenance ap
      ON a.artifactID = ap.artifactID
  `,

  contacts: `
    SELECT
      a.artifactID,
      a.accessionNo,

      cp.contactPersonFullName,
      cp.dateCollectedByContactPerson,
      cp.receiverFullName,
      cp.receivedByReceiverDate,
      cp.recordedBy

    FROM Artifacts a

    LEFT JOIN ContactPersons cp
      ON a.artifactID = cp.artifactID
  `,

  acquisition: `
    SELECT
      a.artifactID,
      a.accessionNo,

      ap.ethnicGroup,
      ap.locality,
      ap.placeOfOrigin,

      ac.collectionType,
      ac.price

    FROM Artifacts a

    LEFT JOIN ArtifactProvenance ap
      ON a.artifactID = ap.artifactID

    LEFT JOIN Acquisition ac
      ON a.artifactID = ac.artifactID
  `
};


// GET INDIVIDUAL ARTIFACT ( Artifacts Primary)


endpoint.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (id === 'new') {
      return res.send("Adding");
    }

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ error: "Invalid artifact id" });
    }

    const artifactId = Number(id);
    const only = (req.query.only || '').toLowerCase();

    let baseQuery;

    switch (only) {
      case 'physical':
        baseQuery = artifactQueries.physical;
        break;
      case 'names':
        baseQuery = artifactQueries.names;
        break;
      case 'provenance':
        baseQuery = artifactQueries.provenance;
        break;
      case 'contacts':
        baseQuery = artifactQueries.contacts;
        break;
      case 'acquisition':
        baseQuery = artifactQueries.acquisition;
        break;
      default:
        baseQuery = artifactQueries.all;
        break;
    }

    const query = `${baseQuery}\n WHERE a.artifactID = $1`;
    const result = await pool.query(query, [artifactId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Artifact not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch artifacts" });
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
 // must be in json
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

endpoint.put('/:id', async (req, res) => {
    const { id } = req.params;
    const {
        accessionNo, catalogueNo, roomID,
        englishName, vernacularName,
        ethnicGroup, locality, placeOfOrigin,
        contactPersonFullName, dateCollectedByContactPerson, receiverFullName, receivedByReceiverDate, recordedBy,
        artifactDetails, artifactFunction, conditionUponReceipt, specialRemarks,
        collectionType, price,
        artifactLength, artifactWidth, artifactHeight, artifactDiameter,
        categoryID,
        pictureID, angleName, pictureFilePath, isProfilePicture
    } = req.body;
 
    try {
        const check = await pool.query(
            'SELECT artifactID FROM Artifacts WHERE artifactID = $1',
            [id]
        );
        if (check.rowCount === 0) {
            return res.status(404).json({ error: 'Artifact not found' });
        }
 
        await pool.query(
            'UPDATE Artifacts SET accessionNo = $1, catalogueNo = $2, roomID = $3 WHERE artifactID = $4',
            [accessionNo, catalogueNo, roomID, id]
        );
 
        await pool.query(
            'UPDATE ArtifactNames SET englishName = $1, vernacularName = $2 WHERE artifactID = $3',
            [englishName, vernacularName, id]
        );
 
        await pool.query(
            'UPDATE ArtifactProvenance SET ethnicGroup = $1, locality = $2, placeOfOrigin = $3 WHERE artifactID = $4',
            [ethnicGroup, locality, placeOfOrigin, id]
        );
 
        await pool.query(
            'UPDATE ContactPersons SET contactPersonFullName = $1, dateCollectedByContactPerson = $2, receiverFullName = $3, receivedByReceiverDate = $4, recordedBy = $5 WHERE artifactID = $6',
            [contactPersonFullName, dateCollectedByContactPerson, receiverFullName, receivedByReceiverDate, recordedBy, id]
        );
 
        await pool.query(
            'UPDATE PhysicalDescription SET artifactDetails = $1, artifactFunction = $2, conditionUponReceipt = $3, specialRemarks = $4 WHERE artifactID = $5',
            [artifactDetails, artifactFunction, conditionUponReceipt, specialRemarks, id]
        );
 
        await pool.query(
            'UPDATE Acquisition SET collectionType = $1, price = $2 WHERE artifactID = $3',
            [collectionType, price, id]
        );
 
        await pool.query(
            'UPDATE Dimensions SET artifactLength = $1, artifactWidth = $2, artifactHeight = $3, artifactDiameter = $4 WHERE artifactID = $5',
            [artifactLength, artifactWidth, artifactHeight, artifactDiameter, id]
        );
 
        await pool.query(
            'DELETE FROM ArtifactCategories WHERE artifactID = $1',
            [id]
        );
        await pool.query(
            'INSERT INTO ArtifactCategories (artifactID, categoryID) VALUES ($1, $2)',
            [id, categoryID]
        );
 
        await pool.query(
            'UPDATE Pictures SET angleName = $1, pictureFilePath = $2, isProfilePicture = $3 WHERE pictureID = $4',
            [angleName, pictureFilePath, isProfilePicture, pictureID]
        );
 
        res.status(200).json({ message: 'Artifact updated successfully' });
 
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