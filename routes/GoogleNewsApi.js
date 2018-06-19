const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const response = require('../models/Response');

const GoogleNews = require('../models/GoogleNews');


router.get('/', (req, res, next) => {

    const promise = GoogleNews.find(req.query).sort({pubDate: -1});

    promise.then((data) => {
        if (data.length === 0) {
            res.status(404).json(response.setError(99, null, 'GoogleNews list is empty'));
        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.status(400).json(response.setError(err.statusCode, err.message, 'GoogleNews service error.'))

    });
});

module.exports = router;