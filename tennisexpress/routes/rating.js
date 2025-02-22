'use strict';

const { Player } = require("../models/Player.js");

var express = require('express');

var router = express.Router();

router.get('/', async function (req, res) {

    //console.log("GET player / rating router");
    
    try {
        const players = await Player.find({ });
        res.json(players);
    } catch (error) {
        res.status(500).json({ error: 'Mongoose: player rating data not found' });
    }

});

router.post('/', async function (req, res) {

    try
    {
        var rating = req.body;
        var id = rating.id;
        res.json(rating);   
    }
    catch (error)
    {
        res.status(500).json({ error: 'Mongoose: player rating data not found' });
    }

});

module.exports = router;