'use strict';
var express = require('express');
var router = express.Router();

const service1 = require("../services/tennisservice.js");


///:userId

router.get('/:id', async function (req, res) {
   
    //const id = parseInt(req.params.id.split("id=")[1]);
    const id = req.params.id;

    //console.log("===> REQUEST ID FOUND  = " + id);

    var tournaments = {};

    service1.getTournaments(id)
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
                console.log("RENDER MATCHES FROM BUTTON EVENT");
                res.render("index", { 'tournaments': tournaments });
            }

        })
        .catch(error => {
            console.log(error);
            res.render("index", { 'tournaments': tournaments });
        });

});

/* GET home page. */
router.get('/', async function (req, res) {
    
    var tournaments = {};
    service1.getTournaments(0)
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
                console.log("########## RENDER WITHOUT ID ##########");
                res.render("index", { 'tournaments': tournaments });
            }
            
        })
        .catch(error => {
            console.log(error);
            res.render("index", { 'tournaments': tournaments });            
        });
    
});

module.exports = router;
