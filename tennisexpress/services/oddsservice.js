
// Require these libraries
var jsonQuery = require('json-query');
JSON.truncate = require('json-truncate')

// BETS API url
const SPORTSID = 13;
const ODDSService = "https://api.b365api.com/v2/event/odds?token=212610-grkv7alAClZ83h&event_id=";

var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
};

// headers
var myHeaders = new Headers();
myHeaders.append("token", "212610-grkv7alAClZ83h");


function isFloat(val) {
    var floatValues = /[+-]?([0-9]*[.])?[0-9]+/;
    if (val.match(floatValues) && !isNaN(val)) {
        return true;
    }
}
function addJsonLine(odds, arr) {

    if (odds && odds[0] && odds.length > 0)
    {
            //console.log(odds[0]);

            var odds_val = odds[0];
            var moment = require('moment');
            var timestamp = parseInt(odds_val.add_time);
            var momentStyle = moment.unix(timestamp);
            var add_time = moment(momentStyle).local().format('LLLL');
            var home_od = odds_val.home_od;
            var away_od = odds_val.away_od;
            var ss = odds_val.ss;

        
        if (isFloat(home_od) && isFloat(away_od) && ss != null) {

            arr.push({
                add_time: add_time,
                ss: ss,
                home_od: home_od,
                away_od: away_od
            });
        }

    }
    //console.log(odds['13_1'][0].add_time);
    //console.log(arr);
}

async function getData(url, id) {

    var jsonArray = [];
    //var groupJson = [];

    try {
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
            var r1 = jsonQuery('results[odds][13_1]', {
                //data: JSON.truncate(data, 10)
                 data: data 
            });

            //var r1 = jsonQuery('results[odds][13_1]');


            if (r1 && r1.value) {
                addJsonLine(r1.value, jsonArray);
            }
        }
    }

    catch (error) {
        console.error(error.message);
    }

    //console.log(jsonArray);
    return jsonArray;
};

class OddsService {
    constructor() {
        this.getOdds = this.getOdds.bind(this);
    }

    async getOdds(id) {

        return new Promise((resolve) => {
            var url = ODDSService + id;
            //console.log("ODDS targel url: " + url);
            var oddsdata = getData(url, SPORTSID); // tennis sportsId is 13
            resolve(oddsdata);
        });
    }
}


module.exports = new OddsService();
