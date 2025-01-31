'use strict';
var express = require('express');
var router = express.Router();

const service1 = require("../services/MatchService");


/* GET home page. */
router.get('/', async function (req, res) {


    var matchlist = null;

    service1.getMatches()
        .then(result => {
            matchlist = result;
            console.log(matchlist);            
            res.render('index',matchlist);
            
            
        })
        .catch(error => {
            console.log(error);
            //handle any errors here
        }); 

    
    
    
});

module.exports = router;
