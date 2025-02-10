
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



var tournamentTypeOK = function (tournament) {

    return !tournament.endsWith("MD") && !tournament.endsWith("WD") && !tournament.startsWith("ITF")

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
        if (value.eventid > 0)
            eventIds.push(value.eventid);
    }

    if (eventIds && eventIds.length > 0) {

        await service2.getAllOdds(eventIds)
            .then(result => {
                var oddsdata = result;               

                if (oddsdata === undefined || oddsdata.length <= 0) {
                    //console.log('odds data empty');
                }
                else {                
                    for (var obj in arr) {                         
                        var eventid = parseInt(arr[obj].eventid);                        
                        //console.log("TENNIS SERVICE >>>> addOddsData ######  " + eventid);                        
                        for (var key in oddsdata) {
                            var odds = oddsdata[key];
                            if (odds) {
                                //console.log(odds[0]);
                                if (odds[0].eventid == eventid) {
                                    arr[obj].odd1 = odds[0].home_od;
                                    arr[obj].odd2 = odds[0].away_od;
                                }
                            }                            
                        }
                        
                    }

                    //console.log(arr);

                    return arr;
                    
                }

            })
            .catch(error => {
                console.log(error);                
            });
    }
}

async function groupData (arr) {

    var groupJson = [];
    //console.log(arr);
    if (arr && arr.length > 0) {
    //addOddsData(arr).then((values) => {

        //    //console.log(arr);
        //    //resolve(values);

        //});


        arr = arr.sort(compareFn);       
        groupJson = groupBy(arr, 'tournament');       
        //console.log(groupJson);
        
    }
    return groupJson;
    
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

    try
    {
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }        

        const data = await response.json();

        if (data)
        {
            var r1 = jsonQuery('results', {
                data: JSON.truncate(data, 10)
            });

            
            for (i = 0; i < r1.value.length; i++) {

                var result = r1.value[i];               
                var tournament = result.league.name.split(" ").join("");
                if (tournamentTypeOK(tournament)) {
                    addJsonLine(result, jsonArray);
                }
            }
            var gdata = groupData(jsonArray);
            return gdata;
        }
    }

    catch (error) {
        console.error(error.message);
    }
};

class TennisService {

    //static eventIds = [];
    //static tournaments = [];    

    constructor() {
        this.getTournaments = this.getTournaments.bind(this);
    }

    static eventIds = [];
    static tournaments = [];

    static getEvents = function () {  // Public Method

        return this.tournaments; 
    };

    static setEvents(t)
    {
        this.tournaments = t;
    }

    static seteventIds(e) {
        this.eventIds = e;
    }

    static hasEvents = function() {  

        return this.tournaments && this.tournaments.length > 0;
    };
     

    async getEventIds() {

       // var eventIds = [];
        var tournaments = TennisService.getEvents();

        if (!this.hasEvents)
        {
            console.log("######### EVENTS NOT FOUND #########");
            return this.eventIds;
        }
        else
        {
            //console.log("######### GET EVENT ID #########");
            //console.log(tournaments);

            for (var key in tournaments) {
                var valueArray = tournaments[key];
                for (var obj in valueArray) {
                    var val = valueArray[obj].eventId;
                    this.eventIds.push(val);
                    console.log("######### PUSH EVENT ID #########");
                    console.log(val);
                }
            }
        }

        return this.eventIds;
    }

    async getTournaments(id) {

        return new Promise((resolve) => {
            var url = (id == 0 ? INPLAY : UPCOMING);

            var tournaments = getData(url, SPORTSID); // tennis sportsId is 13
            //this.tournaments = tournaments;            

            resolve(tournaments);
        });
    }
}


module.exports = new TennisService();
