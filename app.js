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

const app = express();

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('google');
});

// get the possible 10 products via https request and return
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
        console.log('result.name == ' + productText);
        res.render('google',{match:productText,error:null});
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
// [END gae_node_request_example]
