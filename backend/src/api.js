const express = require('express');
const pool = require("./db");
const app = express();

app.use(express.json());

const artifactEndpoint = require('./endpoints/artifacts')
const imageEndpoint = require('./endpoints/images')/*Delete later */

app.use('/api/v1/artifacts',artifactEndpoint);
app.use('/api/v1/image', imageEndpoint);

app.get("/test-db", async (req, res) => {
    try {

        const result = await pool.query("SELECT 1");
        res.json({message: "Database is running"});
        
    }catch (err){
        console.error(err);
        res.status(500).send("DB FAILED")
    }
    
});


app.listen(3000, () => {
    console.log("API is up and running")
}); //Use .env soon (testing only for now)

