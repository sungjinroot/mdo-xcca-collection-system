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

// POST Category
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
  } = req.body

  if (!accessionNo || !catalogueNo || !roomID) {
    return res.status(400).json({ error: 'accessionNo, catalogueNo, and roomID are required' })
  }

  try {

    const artifactResult = await pool.query(
      'INSERT INTO Artifacts (accessionNo, catalogueNo, roomID) VALUES ($1, $2, $3) RETURNING artifactID',
      [accessionNo, catalogueNo, roomID]
    )
    const artifactID = artifactResult.rows[0].artifactid

    await pool.query(
      'INSERT INTO ArtifactNames (artifactID, englishName, vernacularName) VALUES ($1, $2, $3)',
      [artifactID, englishName, vernacularName]
    )

    await pool.query(
      'INSERT INTO ArtifactProvenance (artifactID, ethnicGroup, locality, placeOfOrigin) VALUES ($1, $2, $3, $4)',
      [artifactID, ethnicGroup, locality, placeOfOrigin]
    )

    await pool.query(
      'INSERT INTO ContactPersons (artifactID, contactPersonFullName, dateCollectedByContactPerson, receiverFullName, receivedByReceiverDate, recordedBy) VALUES ($1, $2, $3, $4, $5, $6)',
      [artifactID, contactPersonFullName, dateCollectedByContactPerson, receiverFullName, receivedByReceiverDate, recordedBy]
    )

    await pool.query(
      'INSERT INTO PhysicalDescription (artifactID, artifactDetails, artifactFunction, conditionUponReceipt, specialRemarks) VALUES ($1, $2, $3, $4, $5)',
      [artifactID, artifactDetails, artifactFunction, conditionUponReceipt, specialRemarks]
    )

    await pool.query(
      'INSERT INTO Acquisition (artifactID, collectionType, price) VALUES ($1, $2, $3)',
      [artifactID, collectionType, price]
    )

    await pool.query(
      'INSERT INTO Dimensions (artifactID, artifactLength, artifactWidth, artifactHeight, artifactDiameter) VALUES ($1, $2, $3, $4, $5)',
      [artifactID, artifactLength, artifactWidth, artifactHeight, artifactDiameter]
    )

    await pool.query(
      'INSERT INTO ArtifactCategories (artifactID, categoryID) VALUES ($1, $2)',
      [artifactID, categoryID]
    )

    await pool.query(
      'INSERT INTO Pictures (artifactID, angleName, pictureFilePath, isProfilePicture) VALUES ($1, $2, $3, $4)',
      [artifactID, angleName, pictureFilePath, isProfilePicture]
    )

    res.status(201).json({ message: 'Artifact created successfully', artifactID })

  } catch (err) {
    console.error('DB ERROR:', err)
    res.status(500).json({ error: err.message })
  }
})

//DELETE Category
endpoint.delete('/:id', async (req, res) => {
  console.log('req.body:', req.body)  
  const {categoryid} = req.body

  try {
    const result = await pool.query(
      'DELETE FROM categories WHERE categoryid=$1 RETURNING *',
      [categoryid]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' })
    }
    
    res.status(201).json({message: "category deleted"})
  } catch (err) {
    console.error('DB ERROR:', err)
    res.status(404).json({ error: err.message })
  }
})
module.exports = endpoint;