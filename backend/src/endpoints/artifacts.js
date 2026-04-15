const express = require('express');
const endpoint = express.Router();


endpoint.get('/',(request,response) => {
    response.send("Artifact list");
});

endpoint.get('/new',(request,response) => {
    response.send("Adding")
});

module.exports = endpoint;