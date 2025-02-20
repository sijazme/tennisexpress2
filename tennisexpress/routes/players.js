'use strict';
var express = require('express');
var router = express.Router();

// service references
const service3 = require("../services/playerservice.js");


async function getPlayersData() {

    var data = [];

    await service3.getAllPlayers().then(result => {

        data = result;
       // console.log(playersdata);
        
    })
    .catch(error => {
        console.log(error);

    });

    return data;
}

router.get('/', async function (req, res) {

    getPlayersData().then(result => {
        // console.log(result);
        res.json(result);
    })
    .catch(error => {
        console.log(error);

    });

});


module.exports = router;