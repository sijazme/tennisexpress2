'use strict';
var express = require('express');
var router = express.Router();

const service1 = require("../services/tennisservice.js");


/* GET home page. */
router.get('/', async function (req, res) {


    var tournaments = {};

    if (req.params.type == 'inplay') {
        res.send('display inplay matches');
    } else if (req.params.type == 'upcoming') {
        res.send('display inplay matches');
    } 

    service1.getTournaments()
        .then(result => {

            tournaments = result;            

            if (tournaments.length <= 0) {

                console.log("no tournaments found");
                
            }
            else {

                for (var key in tournaments) {
                    var valueArray = tournaments[key];
                    //console.log(key + ": " + valueArray);
                }

                res.render("index", { 'tournaments': tournaments });
            }
            
        })
        .catch(error => {
            console.log(error);
            res.render("index", { 'tournaments': tournaments });            
        });
    
});

module.exports = router;
