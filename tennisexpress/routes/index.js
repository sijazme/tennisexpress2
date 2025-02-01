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

            console.log(tournaments);

            if (!tournaments?.length) {

                console.log("no tournaments found");
                
            }
            else {
                
                res.render("index", { 'tournaments': tournaments });
            }
            
        })
        .catch(error => {
            console.log(error);
            res.render("index", { 'tournaments': tournaments });            
        });
    
});

module.exports = router;
