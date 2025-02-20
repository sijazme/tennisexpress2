
// Require these libraries
var jsonQuery = require('json-query');
JSON.truncate = require('json-truncate')

// BETS API url

const ODDSService = "https://api.b365api.com/v2/event/odds/summary?token=212610-grkv7alAClZ83h&event_id=";

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
async function addJsonLine(eventid, oddsdata) {

    var arr = [];    

    if (eventid > 0 && oddsdata) {

        var moment = require('moment');
        var timestamp = parseInt(oddsdata.add_time);
        var momentStyle = moment.unix(timestamp);
        var add_time = moment(momentStyle).local().format('LLLL');
        var home_od = oddsdata.home_od;
        var away_od = oddsdata.away_od;
        var ss = oddsdata.ss;


        arr.push({
            eventid: eventid,
            add_time: add_time,
            ss: ss,
            home_od: parseFloat(home_od).toFixed(2),
            away_od: parseFloat(away_od).toFixed(2)
        });

        
    }

    return arr;
   
}

async function getData(eventid) {

    var arr = [];
    var url = ODDSService + eventid;
    
    try {
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();

        var r1 = jsonQuery('results.Bet365.odds.end.13_1', {
            data: data
        });

        if (r1 && r1.value) {

            var oddsdata = r1.value;
            arr = await addJsonLine(eventid, oddsdata, arr);
            if (arr && arr.length > 0) {
               // console.log(arr);
                return arr;
            }
            
           
        }
    }

    catch (error) {
        console.error(error.message);
    }
    
};

class OddsService {
    constructor() {
        this.getOdds = this.getOdds.bind(this);
    }

    async getOdds(id) {

        return new Promise((resolve) => {
            
            var oddsdata = getData(id); // tennis sportsId is 13
            resolve(oddsdata);
        });
    }

    async getAllOdds(eventids) {

        var oddsArray = [];
        
        return new Promise((resolve) => {

            for (var i = 0; i < eventids.length; i++) {

                //console.log(eventids[i]);
                var eventid = parseInt(eventids[i]);

                if (eventid > 0) {
                    var oddsdata = getData(eventid);                   
                    oddsArray.push(oddsdata);
                  
                }                
            }

            Promise.all(oddsArray).then((values) => {
                //console.log(values);
                resolve(values);
               
            });
        });
    }
}


module.exports = new OddsService();
