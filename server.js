'use strict';
const express = require('express');
// Constants
const PORT = 8080;
//const HOST = 'localhost';

// Ecosia Testing
const HOST = 'http://local.ecosia.org/tree'

//Setting Constant METHOD to get since this what we want as the only allowable method
const METHOD = 'GET';

// HTTP Requests Allowed
// Only Accepting GET Requests
const http = require('http');
//const request = require('request')
//constGetReq = {
//  url: 'http://local.ecosia.org/tree',
//};

//Return the GET request
//request.get(GettReq, (err, res, body) => {
//    if (err) {
//        return console.log(err);
//    }

//    console.log(body);
//    console.log(`You have successfully made the post request`);
//});

// App
const app = express();
app.get('/', (req, res) => {
res.send('Hello world\n');
});
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
