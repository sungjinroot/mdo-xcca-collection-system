const express = require('express');
const endpoint = express.Router();
const pool = require('../db');

endpoint.post("/:id", async (req,res) => {
    //id is artifactId
    const artifactId = req.params;

    res.status(200).send("Successful Ping");
});




module.exports = endpoint;