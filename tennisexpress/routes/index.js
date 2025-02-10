'use strict';
var express = require('express');
var router = express.Router();

const service1 = require("../services/tennisservice.js");
// ODDS Service reference
const service2 = require("../services/oddsservice.js");
const tennisservice = require('../services/tennisservice.js');

var eventIds = [];
var events = [];

var check = function () {
    if (events && events.length > 0) {
        // run when condition is met
    }
    else {
        setTimeout(check, 1000); // check again in a second
    }
};

router.get('/:id', async function (req, res) {

    //const id = parseInt(req.params.id.split("id=")[1]);
    const id = req.params.id;    
    var tournaments = [];
    
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
});

/* GET home page. */
router.get('/', async function (req, res) {

    var tournaments = [];

    await service1.getTournaments(1).then(result => {

        tournaments = result;

        if (tournaments == null) {

            console.log("no tournaments found");

        }
        else {
            
            for (var key in tournaments) {
                var valueArray = tournaments[key];
                for (var obj in valueArray) {
                    var val = valueArray[obj].eventid;
                    eventIds.push(val);
                    events.push(valueArray[obj]);
                    //console.log(valueArray[obj]);
                }
            }

        }

    })
        .catch(error => {
            console.log(error);
            res.render("index", { 'tournaments': tournaments });
        });

    check();
    //console.log(events);
    service2.getAllOdds(eventIds).then(result => {
        var oddsdata = result;
        //console.log(oddsdata);

        if (events && events.length <= 0) {
            console.log("service1 has not finished getting tournament data");
        }

        else {
            if (oddsdata == null || oddsdata === undefined || oddsdata.length <= 0) {
                console.log('odds data empty');
            }
            else {

                // MAP ODDS to EVENTS
                for (var obj in events) {
                    var eventid = parseInt(events[obj].eventid);

                    for (var key in oddsdata) {
                        var odds = oddsdata[key];

                        if (odds && odds[0].eventid == eventid) {
                            events[obj].odd1 = odds[0].home_od;
                            events[obj].odd2 = odds[0].away_od;
                        }
                    }
                }
            }
        }

        //console.log(tournaments);

        res.render("index", { 'tournaments': tournaments });

    })
        .catch(error => {
            console.log(error);

        });


    


});

module.exports = router;