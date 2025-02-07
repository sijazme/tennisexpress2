'use strict';
var express = require('express');
var router = express.Router();

const service1 = require("../services/tennisservice.js");
// ODDS Service reference
const service2 = require("../services/oddsservice.js");


///:userId

router.get('/:id', async function (req, res) {

    //const id = parseInt(req.params.id.split("id=")[1]);
    const id = req.params.id;
    var eventIds = [];
    //console.log("===> REQUEST ID FOUND  = " + id);

    var tournaments = {};

    await service1.getTournaments(id)
        .then(result => {

            tournaments = result;

            if (tournaments.length <= 0) {

                console.log("no tournaments found");

            }
            else {

                for (var key in tournaments) {
                    var valueArray = tournaments[key];
                    for (var obj in valueArray) {
                        var val = valueArray[obj].eventId;
                        eventIds.push(val);                        
                    }
                    
                }


                //console.log("RENDER MATCHES FROM BUTTON EVENT");
                res.render("index", { 'tournaments': tournaments });
            }

        })
        .catch(error => {
            console.log(error);
            res.render("index", { 'tournaments': tournaments });
        });

    //console.log(eventIds);

    

});

/* GET home page. */
router.get('/', async function (req, res) {

    var eventIds = [];
    var tournaments = {};
    await service1.getTournaments(0)
        .then(result => {

            tournaments = result;

            if (tournaments.length <= 0) {

                console.log("no tournaments found");

            }
            else {

                for (var key in tournaments) {
                    var valueArray = tournaments[key];
                    for (var obj in valueArray) {
                        var val = valueArray[obj].eventId;
                        eventIds.push(val);
                    }

                }
                res.render("index", { 'tournaments': tournaments });
            }

        })
        .catch(error => {
            console.log(error);
            res.render("index", { 'tournaments': tournaments });
        });


         service2.getAllOdds(eventIds)
        .then(result => {

            var oddsdata = result;

            if (oddsdata === undefined || oddsdata.length <= 0) {

                console.log('odds data empty');

            }
            else {

                //console.log('odds data found');
                console.log(oddsdata);
                //resolve(oddsdata);

            }

        })
        .catch(error => {
            console.log(error);
            //res.render("index", { 'tournaments': tournaments });
        });

});

module.exports = router;