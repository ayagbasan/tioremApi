const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const response = require('../models/Response');
const Tag = require('../models/Catalogue/Tag');
const Article = require('../models/Article');

router.get('/test', (req, res, next) => {
    try {
        res.json(response.setSuccess("Selamün aleyküm"));
    }
    catch (err) {
       res.status(400).json(response.setError(err.statusCode, err.message, 'Tag service error.'));
    };
});


router.post('/', (req, res, next) => {

    req.body._id = new mongoose.Types.ObjectId();
    const tag = new Tag(req.body);
    const promise = tag.save();


    promise.then((data) => {
    
        res.json(response.setSuccess(data));

    }).catch((err) => {

       res.status(400).json(response.setError(err.statusCode, err.message, 'Tag service error.'));

    });
});

router.get('/', (req, res, next) => {

    const promise = Tag.find({}).sort({CreatedAt: -1});

    promise.then((data) => {
        if (data.length===0) {
           res.status(400).json(response.setError(99, null, 'Tag list is empty'));
        } else {

            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

       res.status(400).json(response.setError(err.statusCode, err.message, 'Tag service error.'))

    });
});


router.get('/:id', (req, res, next) => {

    const promise = Tag.findById(req.params.id);

    promise.then((data) => {
        if (!data) {

            res.status(400).json(response.setError(99, null, 'The tag was not found.'));

        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

       res.status(400).json(response.setError(err.statusCode, err.message, 'Tag service error.'))

    });
});

router.put('/:id', (req, res, next) => {
    console.log(req.params.id,req.body);
    let opts = { runValidators: true, new: true };

    const promise = Tag.findOneAndUpdate(
        {
            _id: req.params.id
        },
        {
            "TagName": req.body.TagName,
            "UpdatedAt": Date.now(),
            "Active": req.body.Active
        },
        opts
    );

    promise.then((data) => {
        if (!data) {
            res.status(400).json(response.setError(99, null, 'The tag was not found.'));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
       res.status(400).json(response.setError(err.statusCode, err.message, 'Tag service error.'));
    });
});

router.delete('/:id', (req, res, next) => {

    const id = req.params.id;

    const promise = Tag.remove({ _id: id });

    promise.then((data) => {
        if (!data) {
            res.status(400).json(response.setError(99, null, 'The tag was not found.'));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
       res.status(400).json(response.setError(err.statusCode, err.message, 'Tag service error.'));
    });
});



module.exports = router;