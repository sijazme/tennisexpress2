var url = "https://api.b365api.com/v3/events/inplay?sport_id=13&token=212610-grkv7alAClZ83h";

var myHeaders = new Headers();
myHeaders.append("token", "212610-grkv7alAClZ83h");

var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
};


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

class TennisService {
    constructor() {
        this.getTournaments = this.getTournaments.bind(this);
    }

    async getTournaments() {

        return new Promise((resolve) => {
            const obj = tournaments;
            resolve(obj);
        });
    }
}

module.exports = new TennisService();
