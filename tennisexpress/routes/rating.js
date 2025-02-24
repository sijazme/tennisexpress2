'use strict';

const { Player } = require("../models/Player.js");

var express = require('express');

var router = express.Router();

router.get('/', async function (req, res) {
        
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
        var data = req.body;  // rating data passed in the request body from client.js        
        var id = data[0].id;
        var rating = data[0].rating;

        // Find One is not working!!!
        for await (const doc of Player.find()) {

            if (doc.id == id) {   //console.log(doc);
                doc.rating = rating;
                doc.save();
                res.send(doc);
            }
        }        
    }
    catch (error)
    {
        res.status(500).json({ error: 'Mongoose: player rating data not found' });
    }

});

module.exports = router;