/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
// const env = require('dotenv').config();
const datastore = require('./datastore.js');
const app = express();

app.set('view engine','ejs');
app.use(express.static('public'));
// configure the app to use bodyParser() to extract body from request.
app.use(bodyParser.urlencoded({ extended: false }));
// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }));

app.get('/', (req, res) => {
  res.render('google');
});

// get the possible sample products via https request and return
app.post('/', (req, res) => {
  let product = req.body.product;
  let fetchdataurl = 'https://raw.githubusercontent.com/DhruboB/GCPNodeJSTemplate/master/views/public/sampledata.json';
  request(fetchdataurl, function(err, response, body){
    if(err){
      res.render('google',{match:null,error:'Error occured while fetching match'});
    }else{
      let result = JSON.parse(body);
      if(result[0].name == undefined ){
        console.log('result.name == undefined');
        res.render('google',{ match:null,error:'Error occured after fetching products'});
      } else{
        let productText =  result[0].name;
        let jsonResult = JSON.stringify(result[0]);
        res.render('google',{match:jsonResult,error:null});
      }
    }
  });
});

// This API end pooint will respospond on key ajax call for autocomplte functionality.
app.post('/search', (req, res, next) => {
  let body = [];
  req.on('error', (err) => {
      console.error(err);
  }).on('data', (chunk) => {
      // Without parsing data it's present in chunks.
      body.push(chunk);
  }).on('end', () => {
      // Finally converting data into readable form
      body = Buffer.concat(body).toString();
      // Setting input back into request, just same what body-parser do.
      req.body = body;
      next();
  });
}, (req, res) => {
  let searchText = req.body;
  var result = triestrct.get(searchText);
  res.send(result);  
});

// Returns results for type ahead auto complete items
app.post('/sampleSearch', (req, res) => {
  let searchText = req.body.product;
  let fetchdataurl = 'https://raw.githubusercontent.com/DhruboB/GCPNodeJSTemplate/master/views/public/sampledata.json';
  request(fetchdataurl, function(err, response, body){
    if(err){
      res.render('google',{match:null,error:'Error occured while fetching match'});
    }else{
      let result = JSON.parse(body);
      if(result[0].name == undefined ){
        console.log('result.name == undefined');
        res.render('google',{ match:null,error:'Error occured after fetching products'});
      } else{
        res.send(body);
      }
    }
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END]