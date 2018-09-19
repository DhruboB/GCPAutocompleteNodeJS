'use strict';

// Imports the Google Cloud client library
const Datastore = require('@google-cloud/datastore');
// to read local JSON file
const fs = require('fs');
// introducing trie data structure
const TrieSearch = require('trie-search');
// Your Google Cloud Platform project ID
const projectId = process.env.GOOGLE_PROJECT_ID;

// Creates a client
const datastore = new Datastore({
  projectId: projectId,
});

global.triestrct = new TrieSearch('name', {min: 1});

// bootstraping or caching products name in trie datastructure for quicker search
listProducts();

function listProducts(){
    console.log('Inside listProducts - Start');
    //const query = datastore.createQuery('Product').order('name');
    const query = datastore
                    .createQuery('Product')
                    .order('sku');
        let products = null;
        datastore
        .runQuery(query)
        .then(results => {
            products = results[0];
            let count = 0;
            // this is the place to perform post processing with data.
            triestrct.addAll(products);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });   
        console.log('Data caching is initiated .. please give the system little time before making request.');
        console.log('Inside listProducts - End');
}