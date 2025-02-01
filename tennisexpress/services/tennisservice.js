

var urlUpcoming = "https://api.b365api.com/v3/events/upcoming?sport_id=13&token=212610-grkv7alAClZ83h";

var myHeaders = new Headers();
myHeaders.append("token", "212610-grkv7alAClZ83h");

var jsonQuery = require('json-query');
JSON.truncate = require('json-truncate')


//const fetch = require("node-fetch");


const tournaments =
[
         {
            "name": "WTA",
            "country": "Singapore",
            "matches": [
                {
                    "player1": "Tatjana Maria",
                    "player2": "Elise Merterns",
                },
                {
                    "player1": "Maria Sakkari",
                    "player2": "Xinyu Wang",
                },
                {
                    "player1": "Simona Waltert",
                    "player2": "Mananchaya Sawangkaew",
                },
                {
                    "player1": "Ann Li",
                    "player2": "C Busca",
                }
            ]
        },

        {
            "name": "WTA",
            "country": "Linz",
            "matches": [
                {
                    "player1": "Aryna Sabalenka",
                    "player2": "Coco Gauff",
                },
                {
                    "player1": "Elena Rybakina",
                    "player2": "Jessica Pegula",
                },
                {
                    "player1": "Daria Kasatkina",
                    "player2": "Danielle Collins",
                },
                {
                    "player1": "Mirra Andreeva",
                    "player2": "Elina Svitolina",
                }
            ]
        }

    ];


function compareFn(a, b) {

    var l1 = parseInt(a[0]);
    var l2 = parseInt(b[0]);

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


async function getData(id) {


    let maindata = new Array();

    const url = urlUpcoming;
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };
    try {
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

            var time = timeConverter(result.time);
            var leagueid = result.league.id;
            var tournamentname = result.league.name.split(" ").join("");
            var player1 = result.home.name;
            var player2 = result.away.name;
            //var tempData = leaguename + ' ' + player1 + ' ' + player2 + ' ' + leagueid + ' ' + time;

            if ((tournamentname.startsWith("WTA") || tournamentname.startsWith("ATP")) && !tournamentname.endsWith("WD")) {
                let dataline = new Array(5);
                dataline[0] = leagueid;
                dataline[1] = time;
                dataline[2] = tournamentname;
                dataline[3] = player1;
                dataline[4] = player2;
                maindata.push(dataline);

            }

        }

        maindata = maindata.sort(compareFn);
        console.log(maindata);
        //resolve(maindata);

    }

    catch (error) {
        console.error(error.message);
    }

    return maindata;


    //return new Promise((resolve) => {


        
    //})
};

class TennisService {
    constructor() {
        this.getTournaments = this.getTournaments.bind(this);
    }

    async getTournaments() {

        return new Promise((resolve) => {
            var upcomingEvents =  getData(13); // tennis sportsId is 13
            //console.log(upcomingEvents);
            const obj = tournaments;
            resolve(obj);
        });
    }
}

module.exports = new TennisService();
