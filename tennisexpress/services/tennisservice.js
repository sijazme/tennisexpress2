
// Require these libraries
var jsonQuery = require('json-query');
JSON.truncate = require('json-truncate')

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
    return !tournament.endsWith("MD") && !tournament.endsWith("WD") && !tournament.startsWith("ITF");
};
function compareFn(a, b) {

    var l1 = parseInt(a["timestamp"]);
    var l2 = parseInt(b["timestamp"]);

    if (l1 < l2) {        
        return -1;
    } else if (l1 < l2) {        
        return 1;
    }
    return 0;
}

async function groupData (arr) {

    var groupJson = [];

    if (arr && arr.length > 0) {
        //arr = arr.sort(compareFn);       
        groupJson = groupBy(arr, 'tournament');
        
    }
    return groupJson;
    
}

var playername = function (name) {
    var firstWords = [];

    var words = name.split(" ");
    for (var key in words) {
        if (words[key].length > 1) {
            var strname = String(words[key]);

            if (strname.length == 1) {
                firstWords - [];
                break;
            }

            if (strname.indexOf('/') == -1) {
                firstWords.push(words[key]);
            }
        }
    }

    return firstWords.join('');
};

function titleCase(s) {
    return s.toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

async function addJsonLine(result, arr)
{
    var eventid = parseInt(result.id);
        // add time
    var moment = require('moment');
    var timestamp = parseInt(result.time);
    var momentStyle = moment.unix(timestamp);

    var timeStart = moment(momentStyle).local();    
    var timenow = moment().local();

    var timeStartformatted = moment(momentStyle).local().format('LLLL');

    var duration = moment.duration(timeStart.diff(timenow));
    var minutes = duration.asMinutes();

    var countdown = (minutes < 0) ? "Now" : Math.floor(minutes)  + " minutes";

    
    var tournament = result.league.name;
    var player1 = titleCase(result.home.name);
    var player2 = titleCase(result.away.name);
    var p1 = playername(player1);
    var p2 = playername(player2);
    var pid1 = result.home.id;
    var pid2 = result.away.id;
    

    if (p1 && p2) {

            arr.push({
                eventid: eventid,
                time: timeStartformatted,
                timestamp: timestamp,
                countdown: countdown,
                tournament: tournament,
                player1: player1,
                player2: player2,
                p1: p1,
                p2: p2,
                pid1: pid1,
                pid2: pid2,
                odd1: '',
                odd2: ''
        
            });   
    }
}

async function getData(url, id) {
        
    var jsonArray = [];

    try
    {
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
             throw new Error(`TOO MANY REQUESTS TO BETS API, response : ${response.status}`);
            //return res.send(`${response.status} : BETS API is not responding`);
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

            var arr = sortTournaments(jsonArray);
            var gdata = groupData(arr);
            return gdata;
        }
    }

    catch (error) {
        console.error(error);
    }
};

function sortTournaments(jsonArray) {
    var wta = [];
    var atp = [];
    var challenger = [];
    var others = [];

    for(var key in jsonArray)
    {
        var obj = jsonArray[key];

        if (obj.tournament.startsWith("WTA"))
        {
            wta.push(obj);
        }

        else if (obj.tournament.startsWith("ATP")) {
            atp.push(obj);
        }

        else if (obj.tournament.startsWith("Challenger")) {
            challenger.push(obj);
        }

        else  {
            others.push(obj);
        }
    }

    var arr = wta.concat(atp).concat(challenger).concat(others);

    //console.log(arr);

    return arr;


}

class TennisService {
    constructor() {
        this.getTournaments = this.getTournaments.bind(this);
    }

    async getTournaments(id) {

        return new Promise((resolve) => {
            var url = (id == 0 ? INPLAY : UPCOMING);
            var tournaments = getData(url, SPORTSID); // tennis sportsId is 13
            resolve(tournaments);
        });
    }
}


module.exports = new TennisService();
