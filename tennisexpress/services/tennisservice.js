
// Require these libraries
var jsonQuery = require('json-query');
JSON.truncate = require('json-truncate')


// ODDS Service reference
const service2 = require("../services/oddsservice.js");

// BETS API url

const UPCOMING = "https://api.b365api.com/v3/events/upcoming?sport_id=13&token=212610-grkv7alAClZ83h";
const INPLAY = "https://api.b365api.com/v3/events/inplay?sport_id=13&token=212610-grkv7alAClZ83h";

var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
};

// BETSAPI Sports ID for TENNIS

const SPORTSID = 13;

// headers
var myHeaders = new Headers();
// Headers for the GET request
myHeaders.append("token", "212610-grkv7alAClZ83h");

var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

function compareFn(a, b) {

    var l1 = parseInt(a["leagueid"]);
    var l2 = parseInt(b["leagueid"]);

    if (l1 < l2) {        
        return -1;
    } else if (l1 > l2) {        
        return 1;
    }
    return 0;
}

async function addOddsData(arr) {
    
    
    var eventIds = [];

    for (var obj in arr) {
        var value = arr[obj];
        //console.log(value);
        if (value.eventid > 0) {
           // 
            eventIds.push(value.eventid);
        }
    }

   // console.log(eventIds);

    if (eventIds && eventIds.length > 0) {

        service2.getAllOdds(eventIds)
            .then(result => {

                var oddsdata = result;

               

                if (oddsdata === undefined || oddsdata.length <= 0) {

                    console.log('odds data empty');

                }
                else {

                    
                    //console.log('odds data found');
                    //
                    //resolve(oddsdata);

                    //console.log(oddsdata);




                    for (var obj in arr) {

                         
                        var eventid = parseInt(arr[obj].eventid);                        
                        //console.log("TENNIS SERVICE >>>> addOddsData ######  " + eventid);
                        
                        for (var key in oddsdata) {
                            var odds = oddsdata[key];
                            if (odds) {
                                //console.log(odds[0].eventid);
                                if (odds[0].eventid == eventid) {
                                    arr[obj].odd1 = odds[0].home_od;
                                    arr[obj].odd2 = odds[0].away_od;
                                }
                            }                            
                        }

                        
                    }

                    console.log(arr);

                }

            })
            .catch(error => {
                console.log(error);
                //res.render("index", { 'tournaments': tournaments });
            });

    }

     
}


async function addJsonLine(result, arr)
{
    var eventid = parseInt(result.id);

    // add time
    var moment = require('moment');
    var timestamp = parseInt(result.time);
    var momentStyle = moment.unix(timestamp);        
    var time = moment(momentStyle).local().format('LLLL');

    // tournament info
    var tournament = result.league.name;
    var player1 = result.home.name;
    var player2 = result.away.name;

    arr.push({
        eventid: eventid,
        time: time,
        tournament: tournament,
        player1: player1,
        player2: player2,
        odd1: 0,
        odd2: 0
        
    });

   
}

async function getData(url, id) {
        
    var jsonArray = [];
    var groupJson = [];
   
    try
    {
        const response = await fetch(url, requestOptions);


        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }        

        const data = await response.json();
        


        if (data) {
            var r1 = jsonQuery('results', {
                data: JSON.truncate(data, 10)
            });

            
            for (i = 0; i < r1.value.length; i++) {

                var result = r1.value[i];
               
                var tournament = result.league.name.split(" ").join("");

                if (!tournament.endsWith("MD") && !tournament.endsWith("WD") && !tournament.startsWith("ITF")) {
                    addJsonLine(result, jsonArray);
                }
            }

            if (jsonArray && jsonArray.length > 0) {

                addOddsData(jsonArray);
                jsonArray = jsonArray.sort(compareFn);
                groupJson = groupBy(jsonArray, 'tournament');
            }

            //return jsonArray;
            return groupJson;
        }
    }

    catch (error) {
        console.error(error.message);
    }

    //if (jsonArray) {

        
    //    jsonArray = jsonArray.sort(compareFn);
    //    groupJson = groupBy(jsonArray, 'tournament');
    //}

    //return groupJson;
};



class TennisService {
    constructor() {
        this.getTournaments = this.getTournaments.bind(this);
    }

    async getTournaments(id) {

        return new Promise((resolve) => {
            var url = (id == 0 ? INPLAY : UPCOMING);
            //console.log("targel url: " + url);

            var events = getData(url, SPORTSID); // tennis sportsId is 13
            //addOddsData(events);
            //var groupJson = groupBy(events, 'tournament');
            resolve(events);
        });
    }
}


module.exports = new TennisService();
