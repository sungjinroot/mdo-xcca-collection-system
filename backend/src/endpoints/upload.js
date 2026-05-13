const express = require('express');
const endpoint = express.Router();

const multer = require('multer');
const path = require('path');

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
endpoint.post("/artifact", uploadArtifact.array("photos"), (req, res) => {
    const pictureNames = req.body.pictureNames
        ? Array.isArray(req.body.pictureNames)
            ? req.body.pictureNames
            : [req.body.pictureNames] 
        : [];

    const files = req.files.map((file, index) => ({
        name: pictureNames[index] || "",
        filename: file.filename,
        path: file.path,
    }));

    res.json({
        success: true,
        files,
    });
});

module.exports = endpoint;

//upload to directory
// return filepath
//rooms database