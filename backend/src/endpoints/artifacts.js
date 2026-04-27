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