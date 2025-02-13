'use strict';
var express = require('express');
var router = express.Router();

// service references
const service2 = require("../services/oddsservice.js");
var oddsjson = [];

async function mapOdds(oddsdata, eventids) {

    oddsjson = [];
    //console.log(eventids);

    for (var i = 0; i < eventids.length; i++)
    {
        for (var key in oddsdata) {
            var odds = oddsdata[key];
           
            if (odds && odds[0] && odds[0].eventid) {

                var data = odds[0];

                if (data.eventid == eventids[i]) {
                    //console.log(data);

                    oddsjson.push({
                        eventid: data.eventid,
                        odd1: data.home_od,
                        odd2: data.away_od
                    });
                }
            }
        }
    }

    //console.log(oddsjson);
    return oddsjson;
}

async function getOddsData(eventids) {
    
    await service2.getAllOdds(eventids).then(result => {

        var oddsdata = result;

        mapOdds(oddsdata, eventids).then(result => {
            //console.log(result);
            return result;
            })
        .catch(error => {
                console.log(error);

            });
    })
    .catch(error => {
        console.log(error);

    });
}


router.post('/', async function (req, res) {

    const eventids = JSON.parse(JSON.stringify(req.body));
    //console.log(eventids);
    if (eventids)
    {
        return new Promise((resolve) => {

            var oddsdata = getOddsData(eventids);            
            resolve(oddsdata);
        });

    }
    else {

        res.status(400).send({
            message: 'event ids data not found!!!'
        });
    }
    
});


module.exports = router;