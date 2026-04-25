const express = require('express');
const pool = require("./db");
const app = express();

app.use(express.json());

const artifactEndpoint = require('./endpoints/artifacts')
const imageEndpoint = require('./endpoints/images')/*Delete later */
const roomEndpoint = require('./endpoints/rooms')
const categoriesEndpoint = require('./endpoints/categories')

app.use(express.json())
app.use('/api/v1/artifacts',artifactEndpoint);
app.use('/api/v1/image', imageEndpoint);
app.use('/api/v1/rooms', roomEndpoint)
app.use('/api/v1/categories', categoriesEndpoint)

app.get("/test-db", async (req, res) => {
    try {

        const result = await pool.query("SELECT 1");
        res.json({message: "Database is running"});
        
    }catch (err){
        console.error(err);
        res.status(500).send("DB FAILED")
    }
    
});


module.exports = app;

