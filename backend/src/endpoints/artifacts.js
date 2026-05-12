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

const formatArtifact = (row) => ({
    artifacts: {
        artifactID: row.artifactid,
        accessionNo: row.accessionno,
        catalogueNo: row.catalogueno,
        roomID: row.roomid,
        storageLocation: row.storagelocation
    },
    artifactnames: { //humana put
        englishName: row.englishname,
        vernacularName: row.vernacularname
    },
    artifactprovenance: { //humana put
        ethnicGroup: row.ethnicgroup,
        locality: row.locality,
        placeOfOrigin: row.placeoforigin
    },
    contactpersons: { //humana put
        contactPersonFullName: row.contactpersonfullname,
        dateCollectedByContactPerson: row.datecollectedbycontactperson,
        receiverFullName: row.receiverfullname,
        receivedByReceiverDate: row.receivedbyreceiverdate,
        recordedBy: row.recordedby
    },
    dimensions: { //humana put
        artifactLength: row.artifactlength,
        artifactWidth: row.artifactwidth,
        artifactHeight: row.artifactheight,
        artifactDiameter: row.artifactdiameter
    },
    physicaldescription: { //humana put
        artifactDetails: row.artifactdetails,
        artifactFunction: row.artifactfunction,
        conditionUponReceipt: row.conditionuponreceipt,
        specialRemarks: row.specialremarks
    },
    acquisition: {
        collectionType: row.collectiontype,
        price: row.price
    }
})

endpoint.get('/:id', async (req, res) => {
    const {id} = req.params
    const filter = req.query.filter || 'all'

    if (!artifactQueries[filter]) {
        return res.status(400).json({ error: `Invalid filter. Valid filters are: ${Object.keys(artifactQueries).join(', ')}` })
    }

    try {
        const result = await pool.query(artifactQueries[filter] + ' WHERE a.artifactID = $1', [id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Artifact not found' })
        }

        const formattedArtifact = formatArtifact(result.rows[0])
        res.status(200).json(formattedArtifact)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch artifact' })
    }
})

//add photo endpoint soon. separate angleName,pictureFilePath,artifactId,isProfilePicture.

endpoint.post('/', async (req, res) => {
    const {
        accessionNo, catalogueNo, roomID,
        englishName, vernacularName,
        ethnicGroup, locality, placeOfOrigin,
        contactPersonFullName, dateCollectedByContactPerson, receiverFullName, receivedByReceiverDate, recordedBy,
        artifactDetails, artifactFunction, conditionUponReceipt, specialRemarks,
        collectionType, price,
        artifactLength, artifactWidth, artifactHeight, artifactDiameter,
        categories 
    } = req.body;
    if (
        !accessionNo || !catalogueNo || !roomID ||
        !contactPersonFullName || !dateCollectedByContactPerson ||
        !receiverFullName || !receivedByReceiverDate || !recordedBy ||
        !collectionType 
    ) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    //check if categories is an array. if not an array return an error out.
    if (categories) {
        if (!Array.isArray(categories)) {
            return res.status(400).json({ error: 'Categories must be an array' });
        }
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

        if (categories && categories.length > 0) {
            for (const categoryID of categories) {
                await pool.query('INSERT INTO ArtifactCategories (artifactID, categoryID) VALUES ($1, $2)',[artifactID, categoryID]);
            }
        }

        res.status(201).json({ message: 'Artifact created successfully', artifactID });
        
 
 
    } catch (err) {
        console.error('DB ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});

/*
//NEEDS SPECIFIER
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
*/
endpoint.put('/:id/artifactDetails', async (req, res) => {
    const { id } = req.params;
    const {
        categoryID, accessionNo, catalogueNo, roomID  
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
            'DELETE FROM ArtifactCategories WHERE artifactID = $1',
            [id]
        );
        await pool.query(
            'INSERT INTO ArtifactCategories (artifactID, categoryID) VALUES ($1, $2)',
            [id, categoryID]
        );
        res.status(200).json({ message: 'artifactDetails updated successfully' });
 
    } catch (err) {
        console.error('DB ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});

endpoint.put('/:id/artifactNames', async (req, res) => {
    const { id } = req.params;
    const {
        categoryID, englishName, vernacularName    
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
            'UPDATE ArtifactNames SET englishName = $1, vernacularName = $2 WHERE artifactID = $3',
            [englishName, vernacularName, id]
        );
        await pool.query(
            'DELETE FROM ArtifactCategories WHERE artifactID = $1',
            [id]
        );
        await pool.query(
            'INSERT INTO ArtifactCategories (artifactID, categoryID) VALUES ($1, $2)',
            [id, categoryID]
        );
        res.status(200).json({ message: 'artifactNames updated successfully' });
 
    } catch (err) {
        console.error('DB ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});

endpoint.put('/:id/artifactProvenance', async (req, res) => {
    const { id } = req.params;
    const {
        categoryID, ethnicGroup, locality, placeOfOrigin  
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
            'UPDATE ArtifactProvenance SET ethnicGroup = $1, locality = $2, placeOfOrigin = $3 WHERE artifactID = $4',
            [ethnicGroup, locality, placeOfOrigin, id]
        );
        await pool.query(
            'DELETE FROM ArtifactCategories WHERE artifactID = $1',
            [id]
        );
        await pool.query(
            'INSERT INTO ArtifactCategories (artifactID, categoryID) VALUES ($1, $2)',
            [id, categoryID]
        );
        res.status(200).json({ message: 'artifactProvenance updated successfully' });
 
    } catch (err) {
        console.error('DB ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});

endpoint.put('/:id/contactPersons', async (req, res) => {
    const { id } = req.params;
    const {
        categoryID, contactPersonFullName, dateCollectedByContactPerson, receiverFullName, receivedByReceiverDate, recordedBy 
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
            'UPDATE ContactPersons SET contactPersonFullName = $1, dateCollectedByContactPerson = $2, receiverFullName = $3, receivedByReceiverDate = $4, recordedBy = $5 WHERE artifactID = $6',
            [contactPersonFullName, dateCollectedByContactPerson, receiverFullName, receivedByReceiverDate, recordedBy, id]
        );
        await pool.query(
            'DELETE FROM ArtifactCategories WHERE artifactID = $1',
            [id]
        );
        await pool.query(
            'INSERT INTO ArtifactCategories (artifactID, categoryID) VALUES ($1, $2)',
            [id, categoryID]
        );
        res.status(200).json({ message: 'contactPersons updated successfully' });
 
    } catch (err) {
        console.error('DB ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});

endpoint.put('/:id/dimensions', async (req, res) => {
    const { id } = req.params;
    const {
        categoryID, artifactLength, artifactWidth, artifactHeight, artifactDiameter
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
        res.status(200).json({ message: 'dimensions updated successfully' });
 
    } catch (err) {
        console.error('DB ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});

endpoint.put('/:id/physicalDescription', async (req, res) => {
    const { id } = req.params;
    const {
        categoryID, artifactDetails, artifactFunction, conditionUponReceipt, specialRemarks
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
            'UPDATE PhysicalDescription SET artifactDetails = $1, artifactFunction = $2, conditionUponReceipt = $3, specialRemarks = $4 WHERE artifactID = $5',
            [artifactDetails, artifactFunction, conditionUponReceipt, specialRemarks, id]
        );
        await pool.query(
            'DELETE FROM ArtifactCategories WHERE artifactID = $1',
            [id]
        );
        await pool.query(
            'INSERT INTO ArtifactCategories (artifactID, categoryID) VALUES ($1, $2)',
            [id, categoryID]
        );
        res.status(200).json({ message: 'physicalDescription updated successfully' });
 
    } catch (err) {
        console.error('DB ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});

endpoint.put('/:id/acquisition', async (req, res) => {
    const { id } = req.params;
    const {
        categoryID, collectionType, price
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
            'UPDATE Acquisition SET collectionType = $1, price = $2 WHERE artifactID = $3',
            [collectionType, price, id]
        );
        await pool.query(
            'DELETE FROM ArtifactCategories WHERE artifactID = $1',
            [id]
        );
        await pool.query(
            'INSERT INTO ArtifactCategories (artifactID, categoryID) VALUES ($1, $2)',
            [id, categoryID]
        );
        res.status(200).json({ message: 'acquisition updated successfully' });
 
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