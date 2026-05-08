const express = require('express');
const endpoint = express.Router();

const multer = require('multer');
const path = require('path');

// ROOM STORAGE
const roomStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../uploads/rooms');
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
    cb(null, '../../uploads/artifacts');
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
endpoint.post("/room", uploadRoom.single('photo'), (req, res) => {
  console.log("File uploaded");
  res.status(201).json(req.file.filename);
});

// WIP: Upload artifact photo
endpoint.post("/artifact", uploadArtifact.single('photo'), (req, res) => {
  res.json(req.file);
});

module.exports = endpoint;