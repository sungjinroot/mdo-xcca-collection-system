const express = require('express');
const endpoint = express.Router();
const pool = require('../db');

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

      col.collectionName,
      aq.price

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

    LEFT JOIN Acquisition aq
      ON a.artifactID = aq.artifactID
    LEFT JOIN Collection col ON aq.collectionType = col.collectionType
  `,

  physical: `
    SELECT 
      a.artifactID,
      a.accessionNo,
      a.catalogueNo,
      a.roomID,

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
      a.catalogueNo,
      a.roomID,

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
      a.catalogueNo,
      a.roomID,

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
      a.catalogueNo,
      a.roomID,

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
      a.catalogueNo,
      a.roomID,

      ap.ethnicGroup,
      ap.locality,
      ap.placeOfOrigin,

      col.collectionName,
      aq.price

    FROM Artifacts a

    LEFT JOIN ArtifactProvenance ap
      ON a.artifactID = ap.artifactID

    LEFT JOIN Acquisition aq
      ON a.artifactID = aq.artifactID
    LEFT JOIN Collection col ON aq.collectionType = col.collectionType
  `
};

function parseRoomId(roomID) {
  if (roomID === undefined || roomID === '') return undefined;
  const n = parseInt(roomID, 10);
  if (Number.isNaN(n)) return null;
  return n;
}

async function ensureRoomExists(roomID, res) {
  const chk = await pool.query('SELECT 1 FROM Rooms WHERE roomID = $1', [roomID]);
  if (chk.rowCount === 0) {
    res.status(400).json({ error: 'Room not found' });
    return false;
  }
  return true;
}

endpoint.get('/', async (req, res) => {
    const filter = req.query.filter || 'all'

    if (!artifactQueries[filter]) {
        return res.status(400).json({ error: `Invalid filter. Valid filters are: ${Object.keys(artifactQueries).join(', ')}` })
    }

    const usePagination =
        req.query.limit !== undefined ||
        req.query.lastID !== undefined ||
        (typeof req.query.search === 'string' && req.query.search.trim() !== '') ||
        req.query.roomID !== undefined;

    try {
        if (!usePagination) {
            const result = await pool.query(artifactQueries[filter])
            return res.status(200).json(result.rows)
        }

        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 30, 1), 100)
        const lastID = parseInt(req.query.lastID, 10) || 0
        const search = (req.query.search || '').trim()
        const parsedRoomId = parseRoomId(req.query.roomID)
        if (parsedRoomId === null) {
            return res.status(400).json({ error: 'Invalid roomID' })
        }

        const params = []
        let p = 1
        params.push(lastID)

        let where = [`a.artifactID > $${p++}`]

        if (parsedRoomId !== undefined) {
            where.push(`a.roomID = $${p}`)
            params.push(parsedRoomId)
            p++
        }

        if (search) {
            const searchParam = `%${search}%`
            where.push(`(
              EXISTS (
                SELECT 1 FROM ArtifactNames an
                WHERE an.artifactID = a.artifactID
                  AND (an.englishName ILIKE $${p} OR an.vernacularName ILIKE $${p})
              )
              OR EXISTS (
                SELECT 1 FROM ArtifactCategories acat
                INNER JOIN Categories cat ON acat.categoryID = cat.categoryID
                WHERE acat.artifactID = a.artifactID
                  AND cat.categoryName ILIKE $${p}
              )
            )`)
            params.push(searchParam)
            p++
        }

        params.push(limit)
        const sql = `${artifactQueries[filter]} WHERE ${where.join(' AND ')} ORDER BY a.artifactID LIMIT $${p}`

        const result = await pool.query(sql, params)
        const rows = result.rows
        const nextCursor = rows.length > 0 ? rows[rows.length - 1].artifactid : null

        return res.status(200).json({ data: rows, nextCursor })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch artifacts' })
    }
})

endpoint.get('/:id', async (req, res) => {
    const { id } = req.params
    const filter = req.query.filter || 'all'

    if (!artifactQueries[filter]) {
        return res.status(400).json({ error: `Invalid filter. Valid filters are: ${Object.keys(artifactQueries).join(', ')}` })
    }

    const parsedRoomId = parseRoomId(req.query.roomID)
    if (parsedRoomId === null) {
        return res.status(400).json({ error: 'Invalid roomID' })
    }

    try {
        let sql = artifactQueries[filter] + ' WHERE a.artifactID = $1'
        const qp = [id]
        if (parsedRoomId !== undefined) {
            sql += ' AND a.roomID = $2'
            qp.push(parsedRoomId)
        }

        const result = await pool.query(sql, qp)

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Artifact not found' })
        }

        res.status(200).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch artifact' })
    }
})


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
        if (!(await ensureRoomExists(roomID, res))) return;

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

        if (roomID !== undefined && roomID !== null && !(await ensureRoomExists(roomID, res))) return;
 
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
