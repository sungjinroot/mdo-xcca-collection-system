const express = require('express');
const endpoint = express.Router();
const multer = require('multer');
const path = require('path');

const pool = require('../db');


// ROOM STORAGE
const roomStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/app/uploads/rooms');
  },

  filename: function (req, file, cb) {

    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);

    cb(null, uniqueName + ext);
  }
});

// ARTIFACT STORAGE
const artifactStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/app/uploads/artifacts');
  },

  filename: function (req, file, cb) {

    const ext = path.extname(file.originalname);

    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);

    cb(null, uniqueName + ext);
  }
});

const uploadRoom = multer({ storage: roomStorage });
const uploadArtifact = multer({ storage: artifactStorage });


// Upload room photo
endpoint.post("/room", uploadRoom.single('roomPicture'), (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded"
    });
  }

  console.log("File uploaded");

  res.status(201).json({
    success: true,
    filename: req.file.path
  });
});

//Upload artifact photos
endpoint.post("/artifact", uploadArtifact.array("photos"), async (req, res) => {
  try {
    const artifactId = parseInt(req.body.artifactId);
    const pictureNames = req.body.pictureNames
      ? Array.isArray(req.body.pictureNames)
        ? req.body.pictureNames
        : [req.body.pictureNames]
      : [];

    const files = req.files.map((file, index) => ({
      name: pictureNames[index] || "No Name",
      filename: file.filename,
      path: file.path,
    }));

  for (const photo of files) {
    const angle = photo.name;
    const imagePath = "http://127.0.0.1:3000" + photo.path.replace("/app", "");
    await pool.query('INSERT INTO pictures (angleName, pictureFilePath, artifactID, isProfilePicture) VALUES ($1, $2, $3, $4)',[angle, imagePath, artifactId, photo === files[0]]);
  }

    res.json({
      success: true,
      artifactId,
      files,
    });
  } catch (err) {                              
    console.error("Artifact upload error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = endpoint;

//upload to directory
// return filepath
//rooms database