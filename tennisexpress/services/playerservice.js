
// Require these libraries
var jsonQuery = require('json-query');
JSON.truncate = require('json-truncate')

// BETS API url

const playerServiceURL = "https://api.b365api.com/v1/tennis/ranking?token=212610-grkv7alAClZ83h&type_id=3";

var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
};

// headers
var myHeaders = new Headers();
myHeaders.append("token", "212610-grkv7alAClZ83h");

async function getPlayersData() {

    var arr = [];
    var url = playerServiceURL;

    try {

        console.log("### BEFORE RANKING DATA FETCH CALL ###");

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        console.log("### AFTER RANKING DATA FETCH CALL ###");

        const data = await response.json();
        //console.log("### RANKING DATA ###" + data);

        var r1 = jsonQuery('results', {
            data: data
        });

        if (r1 && r1.value) {
            var playerdata = r1.value;
            //console.log(playerdata);
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
        return new Promise((resolve) => {
            var playerdata = getPlayersData();
            resolve(playerdata);          
        });
    }
}

module.exports = new PlayerService();
