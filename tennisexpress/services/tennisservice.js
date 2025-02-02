const UPCOMING = "https://api.b365api.com/v3/events/upcoming?sport_id=13&token=212610-grkv7alAClZ83h";
const INPLAY = "https://api.b365api.com/v3/events/inplay?sport_id=13&token=212610-grkv7alAClZ83h";
const SPORTSID = 13;
var myHeaders = new Headers();
myHeaders.append("token", "212610-grkv7alAClZ83h");
var jsonQuery = require('json-query');
JSON.truncate = require('json-truncate')


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
        //console.log(l1 + " is less than " + l2);
        return -1;
    } else if (l1 > l2) {

        //console.log(l1 + " is greater than " + l2);
        return 1;
    }
    return 0;
}
function getJsonData(jsArray) {
    return JSON.parse(JSON.stringify(jsArray));    
}

async function getData(url, id) {
        
    var jsonArrLine = [];
    
    
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };
    try
        {
            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

                const data = await response.json();

                var r1 = jsonQuery('results', {
                    data: JSON.truncate(data, 10)
                });

                for (i = 0; i < r1.value.length; i++) {

                    var result = r1.value[i];

                    if (result != null) {

                        var tournament = result.league.name.split(" ").join("");

                        if (!tournament.endsWith("MD") && !tournament.endsWith("WD") && !tournament.startsWith("ITF")) {

                            var moment = require('moment');
                            var timestamp = parseInt(result.time);
                            var momentStyle = moment.unix(timestamp);
                            var formattedDate = moment(momentStyle).local().format('LLLL');
                            var leagueid = result.league.id;
                            var time = formattedDate;
                            var tournament = result.league.name.split(" ").join("");
                            var player1 = result.home.name;
                            var player2 = result.away.name;

                            jsonArrLine.push({
                                leagueid: leagueid,
                                time: time,
                                tournament: tournament,
                                player1: player1,
                                player2: player2
                            });
                        }
                    }
        }
    }

    catch (error) {
        console.error(error.message);
    }

    jsonArrLine = jsonArrLine.sort(compareFn);

    var groupbytournament = groupBy(jsonArrLine, 'tournament');    
    return groupbytournament;
};

class TennisService {
    constructor() {
        this.getTournaments = this.getTournaments.bind(this);
    }

    async getTournaments() {

        return new Promise((resolve) => {

            var url = INPLAY;
            var events = getData(url, SPORTSID); // tennis sportsId is 13
            resolve(events);
        });
    }
}

module.exports = new TennisService();
