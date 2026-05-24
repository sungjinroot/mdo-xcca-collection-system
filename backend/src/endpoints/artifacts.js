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
        accessionNo, catalogueNo, roomID, storageLocation,
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
 
    const client = await pool.connect(); //creates client for database transaction rollbacking

    try {
        await client.query('BEGIN');

        const artifactResult = await client.query(`INSERT INTO Artifacts (accessionNo, catalogueNo, roomID, storageLocation)  VALUES ($1, $2, $3, $4) RETURNING artifactID`,[accessionNo, catalogueNo, roomID, storageLocation]);
        const artifactID = artifactResult.rows[0].artifactid;
 
        await client.query(
            'INSERT INTO ArtifactNames (artifactID, englishName, vernacularName) VALUES ($1, $2, $3)',
            [artifactID, englishName, vernacularName]
        );
 
        await client.query(
            'INSERT INTO ArtifactProvenance (artifactID, ethnicGroup, locality, placeOfOrigin) VALUES ($1, $2, $3, $4)',
            [artifactID, ethnicGroup, locality, placeOfOrigin]
        );
 
        await client.query(
            'INSERT INTO ContactPersons (artifactID, contactPersonFullName, dateCollectedByContactPerson, receiverFullName, receivedByReceiverDate, recordedBy) VALUES ($1, $2, $3, $4, $5, $6)',
            [artifactID, contactPersonFullName, dateCollectedByContactPerson, receiverFullName, receivedByReceiverDate, recordedBy]
        );
 
        await client.query(
            'INSERT INTO PhysicalDescription (artifactID, artifactDetails, artifactFunction, conditionUponReceipt, specialRemarks) VALUES ($1, $2, $3, $4, $5)',
            [artifactID, artifactDetails, artifactFunction, conditionUponReceipt, specialRemarks]
        );
 
        await client.query(
            'INSERT INTO Acquisition (artifactID, collectionType, price) VALUES ($1, $2, $3)',
            [artifactID, collectionType, price]
        );
 
        await client.query(
            'INSERT INTO Dimensions (artifactID, artifactLength, artifactWidth, artifactHeight, artifactDiameter) VALUES ($1, $2, $3, $4, $5)',
            [artifactID, artifactLength, artifactWidth, artifactHeight, artifactDiameter]
        );

        if (categories && categories.length > 0) {
            for (const categoryID of categories) {
                await client.query('INSERT INTO ArtifactCategories (artifactID, categoryID) VALUES ($1, $2)',[artifactID, categoryID]);
            }
        }

        await client.query('COMMIT'); // if all queries are successful, ayha pa dayun ma commit tanan sa DB

        res.status(201).json({ message: 'Artifact created successfully', artifactID });
        
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('DB ERROR:', err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

endpoint.put('/:id/artifactDetails', async (req, res) => {
    const { id } = req.params;
    const {
        accessionNo, catalogueNo, storageLocation
    } = req.body;
    
    // catalogueNo validator
    if (catalogueNo !== undefined) {
        const validCatalogueNos = ['A1', 'A2', 'A3', 'A4', 'A5'];
        if (!validCatalogueNos.includes(catalogueNo)) {
            return res.status(400).json({ error: 'catalogueNo must be one of: A1, A2, A3, A4, A5' });
        }
    }

    const updates = [];
    const values = [];

    if (accessionNo !== undefined) updates.push(`accessionNo = $${updates.length + 1}`), values.push(accessionNo);
    if (catalogueNo !== undefined) updates.push(`catalogueNo = $${updates.length + 1}`), values.push(catalogueNo);
    if (storageLocation !== undefined) updates.push(`storageLocation = $${updates.length + 1}`), values.push(storageLocation);

    // Check for empty update FIRST, before any database calls
    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields provided for update' });
    }

    try {
        const check = await pool.query(
            'SELECT artifactID FROM Artifacts WHERE artifactID = $1',
            [id]
        );
        if (check.rowCount === 0) {
            return res.status(404).json({ error: 'Artifact not found' });
        }

        values.push(id);

        await pool.query(
            `UPDATE Artifacts SET ${updates.join(", ")} WHERE artifactID = $${values.length}`,
            values
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
        englishName, vernacularName    
    } = req.body;

    const updates = [];
    const values = [];

    if (englishName !== undefined) updates.push(`englishName = $${updates.length + 1}`), values.push(englishName);
    if (vernacularName !== undefined) updates.push(`vernacularName = $${updates.length + 1}`), values.push(vernacularName);

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields provided for update' });
    }

    try {
        const check = await pool.query(
            'SELECT artifactID FROM Artifacts WHERE artifactID = $1',
            [id]
        );
        if (check.rowCount === 0) {
            return res.status(404).json({ error: 'Artifact not found' });
        }

        values.push(id);

        await pool.query(
            `UPDATE ArtifactNames SET ${updates.join(", ")} WHERE artifactID = $${values.length}`,
            values
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
        ethnicGroup, locality, placeOfOrigin  
    } = req.body;

    const updates = [];
    const values = [];

    if (ethnicGroup !== undefined) updates.push(`ethnicGroup = $${updates.length + 1}`), values.push(ethnicGroup);
    if (locality !== undefined) updates.push(`locality = $${updates.length + 1}`), values.push(locality);
    if (placeOfOrigin !== undefined) updates.push(`placeOfOrigin = $${updates.length + 1}`), values.push(placeOfOrigin);

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields provided for update' });
    }

    try {
        const check = await pool.query(
            'SELECT artifactID FROM Artifacts WHERE artifactID = $1',
            [id]
        );
        if (check.rowCount === 0) {
            return res.status(404).json({ error: 'Artifact not found' });
        }

        values.push(id);

        await pool.query(
            `UPDATE ArtifactProvenance SET ${updates.join(", ")} WHERE artifactID = $${values.length}`,
            values
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
        contactPersonFullName, dateCollectedByContactPerson, receiverFullName, receivedByReceiverDate, recordedBy 
    } = req.body;

    const updates = [];
    const values = [];

    if (contactPersonFullName !== undefined) updates.push(`contactPersonFullName = $${updates.length + 1}`), values.push(contactPersonFullName);
    if (dateCollectedByContactPerson !== undefined) updates.push(`dateCollectedByContactPerson = $${updates.length + 1}`), values.push(dateCollectedByContactPerson);
    if (receiverFullName !== undefined) updates.push(`receiverFullName = $${updates.length + 1}`), values.push(receiverFullName);
    if (receivedByReceiverDate !== undefined) updates.push(`receivedByReceiverDate = $${updates.length + 1}`), values.push(receivedByReceiverDate);
    if (recordedBy !== undefined) updates.push(`recordedBy = $${updates.length + 1}`), values.push(recordedBy);

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields provided for update' });
    }

    try {
        const check = await pool.query(
            'SELECT artifactID FROM Artifacts WHERE artifactID = $1',
            [id]
        );
        if (check.rowCount === 0) {
            return res.status(404).json({ error: 'Artifact not found' });
        }

        values.push(id);

        await pool.query(
            `UPDATE ContactPersons SET ${updates.join(", ")} WHERE artifactID = $${values.length}`,
            values
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
        artifactLength, artifactWidth, artifactHeight, artifactDiameter
    } = req.body;

    const updates = [];
    const values = [];

    if (artifactLength !== undefined) updates.push(`artifactLength = $${updates.length + 1}`), values.push(artifactLength);
    if (artifactWidth !== undefined) updates.push(`artifactWidth = $${updates.length + 1}`), values.push(artifactWidth);
    if (artifactHeight !== undefined) updates.push(`artifactHeight = $${updates.length + 1}`), values.push(artifactHeight);
    if (artifactDiameter !== undefined) updates.push(`artifactDiameter = $${updates.length + 1}`), values.push(artifactDiameter);

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields provided for update' });
    }

    try {
        const check = await pool.query(
            'SELECT artifactID FROM Artifacts WHERE artifactID = $1',
            [id]
        );
        if (check.rowCount === 0) {
            return res.status(404).json({ error: 'Artifact not found' });
        }

        values.push(id);

        await pool.query(
            `UPDATE Dimensions SET ${updates.join(", ")} WHERE artifactID = $${values.length}`,
            values
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
        artifactDetails, artifactFunction, conditionUponReceipt, specialRemarks
    } = req.body;

    const updates = [];
    const values = [];

    if (artifactDetails !== undefined) updates.push(`artifactDetails = $${updates.length + 1}`), values.push(artifactDetails);
    if (artifactFunction !== undefined) updates.push(`artifactFunction = $${updates.length + 1}`), values.push(artifactFunction);
    if (conditionUponReceipt !== undefined) updates.push(`conditionUponReceipt = $${updates.length + 1}`), values.push(conditionUponReceipt);
    if (specialRemarks !== undefined) updates.push(`specialRemarks = $${updates.length + 1}`), values.push(specialRemarks);

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields provided for update' });
    }

    try {
        const check = await pool.query(
            'SELECT artifactID FROM Artifacts WHERE artifactID = $1',
            [id]
        );
        if (check.rowCount === 0) {
            return res.status(404).json({ error: 'Artifact not found' });
        }

        values.push(id);

        await pool.query(
            `UPDATE PhysicalDescription SET ${updates.join(", ")} WHERE artifactID = $${values.length}`,
            values
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
        collectionType, price
    } = req.body;

    // collectionType validator
    if (collectionType !== undefined) {
        const validCollectionTypes = ['A', 'B', 'C', 'D', 'E'];
        if (!validCollectionTypes.includes(collectionType)) {
            return res.status(400).json({ error: 'collectionType must be one of: A, B, C, D, E' });
        }
    }

    // himo ug price validator kung need pa

    const updates = [];
    const values = [];

    if (collectionType !== undefined) updates.push(`collectionType = $${updates.length + 1}`), values.push(collectionType);
    if (price !== undefined) updates.push(`price = $${updates.length + 1}`), values.push(price);

    if (updates.length === 0) {
        return res.status(400).json({ error: 'price must not be empty' });
    }

    try {
        const check = await pool.query(
            'SELECT artifactID FROM Artifacts WHERE artifactID = $1',
            [id]
        );
        if (check.rowCount === 0) {
            return res.status(404).json({ error: 'Artifact not found' });
        }

        values.push(id);

        await pool.query(
            `UPDATE Acquisition SET ${updates.join(", ")} WHERE artifactID = $${values.length}`,
            values
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