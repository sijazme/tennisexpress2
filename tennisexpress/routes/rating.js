'use strict';

const { Player } = require("../models/playermodel.js");

var express = require('express');

var router = express.Router();

router.get('/', async function (req, res) {

    console.log("GET player / rating router");
    
    try {
        const players = await Player.find({ });
        res.json(players);
    } catch (error) {
        res.status(500).json({ error: 'Mongoose: player rating data not found' });
    }

});

module.exports = router;