const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
var response = require('../models/Response');

const Role = require('../models/Catalogue/Role');

router.get('/test', (req, res, next) => {
    try {
        res.json(response.setSuccess("Selamün aleyküm"));
    }
    catch (err) {
        res.json(response.setError(err.statusCode, err.message, 'Role service error.'));
    };
});


router.post('/', (req, res, next) => {

    req.body._id = new mongoose.Types.ObjectId();
    const role = new Role(req.body);
    const promise = role.save();


    promise.then((data) => {

        res.json(response.setSuccess(data));

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'Role service error.'));

    });
});

router.get('/', (req, res, next) => {

    const promise = Role.find({ Active: true }).sort({ RoleName: 1 });

    promise.then((data) => {
        if (data.length === 0) {
            res.status(404).json(response.setError(99, null, 'Role list is empty'));
        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'Role service error.'))

    });
});


router.get('/:id', (req, res, next) => {

    const promise = Role.findById(req.params.id);

    promise.then((data) => {
        if (!data) {

            next(res.json(response.setError(99, null, 'The role was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'Role service error.'))

    });
});

router.put('/:id', (req, res, next) => {
    console.log(req.params.id, req.body);
    let opts = { runValidators: true, new: true };

    const promise = Role.findOneAndUpdate(
        {
            _id: req.params.id
        },
        {
            "RoleName": req.body.RoleName,
            "UpdatedAt": Date.now(),
            "Active": req.body.Active
        },
        opts
    );

    promise.then((data) => {
        if (!data) {
            next(res.json(response.setError(99, null, 'The role was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.json(response.setError(err.statusCode, err.message, 'Role service error.'));
    });
});

router.delete('/:id', (req, res, next) => {

    const id = req.params.id;

    const promise = Role.remove({ _id: id });

    promise.then((data) => {
        if (!data) {
            next(res.json(response.setError(99, null, 'The role was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.json(response.setError(err.statusCode, err.message, 'Role service error.'));
    });
});



module.exports = router;