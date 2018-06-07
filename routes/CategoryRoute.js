const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
var response = require('../models/Response');

const Category = require('../models/Catalogue/Category');

router.get('/test', (req, res, next) => {
    try {
        res.json(response.setSuccess("Selamün aleyküm"));
    }
    catch (err) {
        res.json(response.setError(err.statusCode, err.message, 'Category service error.'));
    };
});


router.post('/', (req, res, next) => {

    req.body._id = new mongoose.Types.ObjectId();
    const category = new Category(req.body);
    const promise = category.save();


    promise.then((data) => {

        res.json(response.setSuccess(data));

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'Category service error.'));

    });
});

router.get('/', (req, res, next) => {

    const promise = Category.find({ Active: true }).sort({ CategoryName: 1 });

    promise.then((data) => {
        if (data.length === 0) {
            res.status(404).json(response.setError(99, null, 'Category list is empty'));
        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'Category service error.'))

    });
});


router.get('/:id', (req, res, next) => {

    const promise = Category.findById(req.params.id);

    promise.then((data) => {
        if (!data) {

            next(res.json(response.setError(99, null, 'The category was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'Category service error.'))

    });
});

router.put('/:id', (req, res, next) => {
    console.log(req.params.id, req.body);
    let opts = { runValidators: true, new: true };

    const promise = Category.findOneAndUpdate(
        {
            _id: req.params.id
        },
        {
            "CategoryName": req.body.CategoryName,
            "UpdatedAt": Date.now(),
            "Active": req.body.Active
        },
        opts
    );

    promise.then((data) => {
        if (!data) {
            next(res.json(response.setError(99, null, 'The category was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.json(response.setError(err.statusCode, err.message, 'Category service error.'));
    });
});

router.delete('/:id', (req, res, next) => {

    const id = req.params.id;

    const promise = Category.remove({ _id: id });

    promise.then((data) => {
        if (!data) {
            next(res.json(response.setError(99, null, 'The category was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.json(response.setError(err.statusCode, err.message, 'Category service error.'));
    });
});



module.exports = router;