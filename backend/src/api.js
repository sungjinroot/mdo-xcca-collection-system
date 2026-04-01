
const express = require('express');

const app = express();


const artifactEndpoint = require('./endpoints/artifacts')
const imageEndpoint = require('./endpoints/images')/*Delete later */

app.use('/api/v1/artifacts',artifactEndpoint);
app.use('/api/v1/image', imageEndpoint);


app.listen(3000, () => {
    console.log("API is up and running")
}); //Use .env soon (testing only for now)
