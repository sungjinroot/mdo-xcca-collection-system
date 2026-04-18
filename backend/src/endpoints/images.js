const express = require('express');

const endpoint = express.Router();

endpoint.get('/nigga', (request,response) => {
    response.send("test")
});

module.exports = endpoint;