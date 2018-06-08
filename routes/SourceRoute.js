const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
var response = require('../models/Response');

const Source = require('../models/Catalogue/Source');

router.get('/test', (req, res, next) => {
    try {
        res.json(response.setSuccess("Selamün aleyküm"));
    }
    catch (err) {
        res.json(response.setError(err.statusCode, err.message, 'Source service error.'));
    };
});


router.post('/', (req, res, next) => {

    req.body._id = new mongoose.Types.ObjectId();
    const source = new Source(req.body);
    const promise = source.save();


    promise.then((data) => {
    
        res.json(response.setSuccess(data));

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'Source service error.'));

    });
});

router.get('/', (req, res, next) => {

    let active=true;
    if(req.body.Active!==undefined)
        active = req.body.Active;

    const promise = Source.find({ Active: active }).sort({ SourceName: 1 });

    promise.then((data) => {
        if (data.length===0) {
           res.status(404).json(response.setError(99, null, 'Source list is empty'));
        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'Source service error.'))

    });
});


router.get('/:id', (req, res, next) => {

    const promise = Source.findById(req.params.id);

    promise.then((data) => {
        if (!data) {

            next(res.json(response.setError(99, null, 'The source was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'Source service error.'))

    });
});

router.put('/:id', (req, res, next) => {
    console.log(req.params.id,req.body);
    let opts = { runValidators: true, new: true };

    const promise = Source.findOneAndUpdate(
        {
            _id: req.params.id
        },
        {
            "SourceName": req.body.SourceName,
            "UpdatedAt": Date.now(),
            "Active": req.body.Active
        },
        opts
    );

    promise.then((data) => {
        if (!data) {
            next(res.json(response.setError(99, null, 'The source was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.json(response.setError(err.statusCode, err.message, 'Source service error.'));
    });
});

router.delete('/:id', (req, res, next) => {

    const id = req.params.id;

    const promise = Source.remove({ _id: id });

    promise.then((data) => {
        if (!data) {
            next(res.json(response.setError(99, null, 'The source was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.json(response.setError(err.statusCode, err.message, 'Source service error.'));
    });
});



module.exports = router;