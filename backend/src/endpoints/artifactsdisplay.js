const express = require('express');
const endpoint = express.Router();
const pool = require('../db');




//GET ALL ARTIFACT ( This is for main page)

endpoint.get('/', async (req, res) => {
    try {
       const result = await pool.query(artifactQueries.all);
  
       res.status(200).json(result.rows); 
  
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch artifacts" });
    }
  });


  module.exports = endpoint;