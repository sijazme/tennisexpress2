'use strict';
var express = require('express');
var router = express.Router();

// service references
const service2 = require("../services/oddsservice.js");

function mapOdds(oddsdata, eventids) {

    var oddsjson = [];
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

    var data = [];

     await service2.getAllOdds(eventids).then(result => {

        var oddsdata = result;
        data = mapOdds(oddsdata, eventids);        
    })
    .catch(error => {
        console.log(error);

    });

    return data;
}

router.post('/', async function (req, res) {

    const eventids = JSON.parse(JSON.stringify(req.body));
    //console.log(eventids);
    if (eventids)
    {
        getOddsData(eventids).then(result =>
        {
            //console.log(result);
            res.json(result);
        })
        .catch(error => {
            console.log(error);

        });
    }    
    else {

        res.status(400).send({
            message: 'event ids data not found!!!'
        });
    }
    
});


module.exports = router;