'use strict';
var express = require('express');
var router = express.Router();

// service references
const service1 = require("../services/tennisservice.js");
const service2 = require("../services/oddsservice.js");


var eventIds = [];
var events = [];


function addOddsData() {

    console.log(eventIds);

     service2.getAllOdds(eventIds).then(result => {
        var oddsdata = result;

        if (events && events.length <= 0) {
            console.log("service1 has not finished getting tournament data");
        }

        else {
            if (oddsdata == null || oddsdata === undefined || oddsdata.length <= 0) {
                console.log('odds data empty');
            }
            else {
                //mapOdds(oddsdata);
                return oddsdata;
            }
        }

    })
    .catch(error => {
        console.log(error);

    });
}

async function getTournaments() {

    var tournaments = [];
    const defaultId = 1;

    service1.getTournaments(defaultId).then(result => {
        tournaments = result;
        if (tournaments == null) {
            console.log("no tournaments found");
        }
        else {

            localizeEvents(tournaments);
        }

        return tournaments;
    })
    .catch(error => {
        console.log(error);
        //res.render("index", { 'tournaments': tournaments });
    });
}
async function localizeEvents(tournaments) {

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

async function mapOdds(oddsdata) {
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

var check = function () {
    if (events && events.length > 0) {
        // run when condition is met
    }
    else {
        setTimeout(check, 1000); // check again in a second
    }
};

async function render(res,id)
{
    var tournaments = [];

    service1.getTournaments(id).then(result => {
        tournaments = result;
        if (tournaments == null) {
            console.log("no tournaments found");
        }
        else {

            localizeEvents(tournaments);

            service2.getAllOdds(eventIds).then(result => {
                var oddsdata = result;

                if (events && events.length <= 0) {
                    console.log("service1 has not finished getting tournament data");
                }

                else {
                    if (oddsdata == null || oddsdata === undefined || oddsdata.length <= 0) {
                        console.log('odds data empty');
                    }
                    else {
                        mapOdds(oddsdata);
                        res.render("index", { 'tournaments': tournaments });
                    }
                }

            })
                .catch(error => {
                    console.log(error);

                });


        }
        
    })
    .catch(error => {
        console.log(error);
        //res.render("index", { 'tournaments': tournaments });
    });

}

router.get('/:id', async function (req, res) {
        
    const id = req.params.id;
    render(res,id);
    
});

/* GET home page. */
router.get('/', async function (req, res) {

    const defaultId = 1;    
    render(res, defaultId);
});


module.exports = router;