'use strict';
var express = require('express');
var router = express.Router();

const service1 = require("../services/TennisService");


/* GET home page. */
router.get('/', async function (req, res) {


    var tournaments = {};

    service1.getTournaments()
        .then(result => {
            tournaments = result;

            if (!tournaments?.length) {

                console.log("no tournaments found");
                
            }
            else {
                console.log(tournaments[0]);
                console.log(tournaments[1]);
                res.render("index", { 'tournaments': tournaments });
            }
            
        })
        .catch(error => {
            console.log(error);
            res.render("index", { 'tournaments': tournaments });
            //handle any errors here
        }); 

    
    
    
});

module.exports = router;
