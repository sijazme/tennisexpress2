

var urlUpcoming = "https://api.b365api.com/v3/events/upcoming?sport_id=13&token=212610-grkv7alAClZ83h";

var myHeaders = new Headers();
myHeaders.append("token", "212610-grkv7alAClZ83h");

var jsonQuery = require('json-query');
JSON.truncate = require('json-truncate')


//const fetch = require("node-fetch");

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


function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}

function getJsonData(jsArray) {
    return JSON.parse(JSON.stringify(jsArray));    
}

async function getData(id) {
        
    var jsonArrLine = [];
    var jsonArray = [];

    const url = urlUpcoming;
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

                if ((tournament.startsWith("WTA") || tournament.startsWith("ATP")) && !tournament.endsWith("MD") && !tournament.endsWith("WD")) {

                    //console.log(tournament + '  ' + result.home.name + ' vs ' + result.away.name);
                    var leagueid = result.league.id;
                    var time = result.time;
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
    //console.log(jsonArrLine);
    return jsonArrLine;
};

class TennisService {
    constructor() {
        this.getTournaments = this.getTournaments.bind(this);
    }

    async getTournaments() {

        return new Promise((resolve) => {
            var upcomingEvents = getData(13); // tennis sportsId is 13
            resolve(upcomingEvents);
        });
    }
}

module.exports = new TennisService();
