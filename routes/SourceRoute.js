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
    console.log(req.body);

    promise.then((data) => {


        res.json(response.setSuccess(data));

    }).catch((err) => {

        res.status(400).json(response.setError(err.statusCode, err.message, 'Source service error.'));

    });
});

router.get('/', (req, res, next) => {

    const promise = Source.find({}).sort({ SourceName: 1 });

    promise.then((data) => {
        if (data.length===0) {
           res.status(400).json(response.setError(99, null, 'Source list is empty'));
        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.status(400).json(response.setError(err.statusCode, err.message, 'Source service error.'))

    });
});

router.get('/:id', (req, res, next) => {

    const promise = Source.findById(req.params.id);

    promise.then((data) => {
        if (!data) {

            res.status(400).json(response.setError(99, null, 'The source was not found'));

        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.status(400).json(response.setError(err.statusCode, err.message, 'Source service error.'))

    });
});

router.put('/', (req, res, next) => {
    console.log(req.body._id,req.body);
    let opts = { runValidators: true, new: true };

    const promise = Source.findOneAndUpdate(
        {
            SourceId: parseInt(req.body.SourceId)
        },
        {
            "SourceName": req.body.SourceName,
            "Description": req.body.Description,
            "ImageUrl": req.body.ImageUrl,
            "SourceWebSite": req.body.SourceWebSite,
            "UpdatedAt": Date.now(),
            "Active":  req.body.Active
        },
        opts
    );

    promise.then((data) => {
        if (!data) {
            res.status(400).json(response.setError(99, null, 'The source was not found'));
        } else {
            res.status(400).json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.status(400).json(response.setError(err.statusCode, err.message, 'Source service error.'));
    });
});

router.delete('/', (req, res, next) => {

    const id = req.body._id;
    const promise = Source.remove({ _id: id });
    promise.then((data) => {
        if (!data) {
            res.status(400).json(response.setError(99, null, 'The source was not found'));
        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.status(400).json(response.setError(err.statusCode, err.message, 'Source service error.'));
    });
});



module.exports = router;