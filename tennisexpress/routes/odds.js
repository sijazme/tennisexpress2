'use strict';
var express = require('express');
var router = express.Router();

// service references
const service2 = require("../services/oddsservice.js");
var events = [];

function mapOdds(oddsdata) {
    // MAP ODDS to EVENTS

    var eventids = [];
    for (var eventid in eventids) {       

        for (var key in oddsdata) {
            var odds = oddsdata[key];

            if (odds && odds[0].eventid == eventid) {
                //events[obj].odd1 = odds[0].home_od;
                //events[obj].odd2 = odds[0].away_od;

                events.push({
                    eventid: eventid,                    
                    odd1: odds[0].home_od,
                    odd2: odds[0].away_od

                });
            }
        }
    }

    console.log(events);
}

function getOddsData(eventids) {
    
    service2.getAllOdds(eventIds).then(result => {
        var oddsdata = result;
        console.log(oddsdata);
        if (events && events.length <= 0) {
            console.log("service1 has not finished getting tournament data");
        }

        else {
            if (oddsdata == null || oddsdata === undefined || oddsdata.length <= 0) {
                console.log('odds data empty');
            }
            else {
                mapOdds(oddsdata);
                return oddsdata;            }
        }

       

    })
    .catch(error => {
        console.log(error);

    });
}


router.post('/', function (req, res) {

    //const eventids = req.body;
    //console.log(" ODDS ROUTE FOUND!!! ");

    const eventids = JSON.parse(JSON.stringify(req.body));
    

    if (eventids)
    {
        console.log(eventids);
        var oddsdata =  getOddsData(eventids);
        
        res.json(oddsdata);

    }
    else {

        res.status(400).send({
            message: 'event ids data not found!!!'
        });

    }
    
});


module.exports = router;