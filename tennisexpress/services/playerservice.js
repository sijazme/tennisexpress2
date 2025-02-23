
// Require these libraries
var jsonQuery = require('json-query');
JSON.truncate = require('json-truncate')

// BETS API url

const playerServiceURL1 = "https://api.b365api.com/v1/tennis/ranking?token=212610-grkv7alAClZ83h&type_id=1";
const playerServiceURL2 = "https://api.b365api.com/v1/tennis/ranking?token=212610-grkv7alAClZ83h&type_id=3";

var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
};

// headers
var myHeaders = new Headers();
myHeaders.append("token", "212610-grkv7alAClZ83h");


async function getPlayersData(typeid) {
        
    var url = typeid == 1 ? playerServiceURL1 : playerServiceURL2;

    try
    {
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        const data = await response.json();
        
        var r1 = jsonQuery('results', {
            data: data
        });

        if (r1 && r1.value) {
            var playerdata = r1.value;
            return playerdata;          
        }
    }

    catch (error) {
        console.error(error.message);
    }
};

class PlayerService {
    constructor() {
        this.getAllPlayers = this.getAllPlayers.bind(this);
    }
        
    async getAllPlayers() {

        var playersArray = [];

        return new Promise((resolve) => {
            var playerdata1 = getPlayersData(1);
            var playerdata2 = getPlayersData(2);

            playersArray.push(playerdata1);
            playersArray.push(playerdata2);

            Promise.all(playersArray).then((values) => {
                //console.log();

                //var fs = require('fs');
                ////fs.writeFile('males.json', values[0], 'utf8', callback);

                //fs.writeFile("males.json", JSON.stringify(values[0]), 'utf8', function (err) {
                //    if (err)
                //        throw err;
                //    console.log('DATA SAVE: male data save complete');
                //});

                //fs.writeFile("females.json", JSON.stringify(values[1]), 'utf8', function (err) {
                //    if (err)
                //        throw err;
                //    console.log('DATA SAVE: female data save complete');
                //});

                resolve(values);

            });
        });
    }


}

module.exports = new PlayerService();
