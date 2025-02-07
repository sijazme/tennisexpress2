
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
async function addJsonLine(eventid, oddsdata, arr) {

    if (oddsdata)
    {

        var data = jsonQuery('13_1', {
            data: oddsdata
        });

        var oddsvalue = data.value;

       // console.log(oddsvalue);

        var moment = require('moment');
        var timestamp = parseInt(oddsvalue.add_time);
        var momentStyle = moment.unix(timestamp);
        var add_time = moment(momentStyle).local().format('LLLL');
        var home_od = oddsvalue.home_od;
        var away_od = oddsvalue.away_od;
        var ss = oddsvalue.ss;

        
        if (isFloat(home_od) && isFloat(away_od) && ss != null) {

            arr.push({
                eventid: eventid,
                add_time: add_time,
                ss: ss,
                home_od: home_od,
                away_od: away_od
            });
        }

    }
   
}

async function getData(eventid) {

    var jsonArray = [];
    var url = ODDSService + eventid;
    
    try {
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        var oddsdata = data.results.Bet365.odds.end;
                

        if (oddsdata) {
            
            addJsonLine(eventid, oddsdata,  jsonArray);        
            return jsonArray;
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
          
            //console.log("ODDS targel url: " + url);
            var oddsdata = getData(id); // tennis sportsId is 13
            resolve(oddsdata);
        });
    }

    async getAllOdds(eventids) {

        var oddsArray = [];
        //console.log(eventids[i]);

        

        return new Promise((resolve) => {

            for (i = 0; i < eventids.length; i++) {

                console.log(eventids[i]);
                var oddsdata = getData(eventids[i]);
                oddsArray.push(oddsdata);
            }


            Promise.all(oddsArray).then((values) => {
                resolve(values);
            });
        });

        //return new Promise((resolve) => {

        //    console.log(eventids[0]);
        //    //var oddsdata = getData(eventids[0]);
        //    var oddsdata1 = getData(eventids[0]);
        //    var oddsdata2 = getData(eventids[1]);
        //    var oddsdata3 = getData(eventids[2]);
        //    //console.log(oddsdata1);
        //    ////console.log(oddsdata2);
        //    ////console.log(oddsdata3);


        //    oddsArray.push(oddsdata1);
        //    oddsArray.push(oddsdata2);
        //    oddsArray.push(oddsdata3);




        //});

        

    }
}


module.exports = new OddsService();
