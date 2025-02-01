'use strict';
var express = require('express');
var router = express.Router();

const service1 = require("../services/MatchService");


/* GET home page. */
router.get('/', async function (req, res) {


    var tournament = null;

    service1.getMatches()
        .then(result => {
            tournament = result;

            if (!tournament.matches?.length) {

                console.log("no matches found");
                
            }
            else {
                console.log(tournament);
                res.render("index", { 'tournament': tournament });
            }
            
        })
        .catch(error => {
            console.log(error);
            //handle any errors here
        }); 

    
    
    
});

module.exports = router;
