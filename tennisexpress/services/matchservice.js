var url = "https://api.b365api.com/v3/events/inplay?sport_id=13&token=212610-grkv7alAClZ83h";

var myHeaders = new Headers();
myHeaders.append("token", "212610-grkv7alAClZ83h");

var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
};


const tournament = {
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
};

class MatchService {
    constructor() {
        this.getMatches = this.getMatches.bind(this);
    }

    async getMatches() {

        return new Promise((resolve) => {
            const obj = tournament;
            resolve(obj);
        });
    }
}

module.exports = new MatchService();
