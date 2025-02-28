'use strict';

var express = require('express');
var router = express.Router();

router.get('/', async function (req, res) {

    try {
        res.render("home", {});
    } catch (error) {
        res.status(500).json({ error: 'Mongoose: player rating data not found' });
    }

});

module.exports = router;