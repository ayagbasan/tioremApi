const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
var response = require('../models/Response');

const Article = require('../models/Article');
const Source = require('../models/Catalogue/Source');
const Tag = require('../models/Catalogue/Tag');



router.get('/test', (req, res, next) => {
    try {
        res.json(response.setSuccess("Selamün aleyküm"));
    }
    catch (err) {
        res.json(response.setError(err.statusCode, err.message, 'Article service error.'));
    };
});

router.post('/', (req, res, next) => {

    req.body._id = new mongoose.Types.ObjectId();
    const article = new Article(req.body);
    const promise = article.save();

    promise.then((data) => {

        res.json(response.setSuccess(data));

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'Article service error.'));

    });
});

router.get('/', (req, res, next) => {

    const promise = Article.find({ Active: true }).sort({ ArticleName: 1 });

    promise.then((data) => {
        if (data.length === 0) {
            res.status(404).json(response.setError(99, null, 'Article list is empty'));
        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'Article service error.'))

    });
});


router.get('/:id', (req, res, next) => {

    const promise = Article.findById(req.params.id);

    promise.then((data) => {
        if (!data) {

            next(res.json(response.setError(99, null, 'The article was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'Article service error.'))

    });
});

router.put('/:id', (req, res, next) => {
    console.log(req.params.id, req.body);
    let opts = { runValidators: true, new: true };

    const promise = Article.findOneAndUpdate(
        {
            _id: req.params.id
        },
        {
            "SourceId": req.body.SourceId,
            "CategoryId": req.body.CategoryId,
            "Tags": req.body.Tags,
            "ArticleUrl": req.body.ArticleUrl,
            "SourceUrl": req.body.SourceUrl,
            "Title": req.body.Title,
            "SharingTitle": req.body.SharingTitle,
            "Body": req.body.Body,
            "PubDate": req.body.PubDate,
            "DetailedDate": req.body.DetailedDate,
            "VideoUrl": req.body.VideoUrl,
            "ImageUrl": req.body.ImageUrl,
            "FavoriteHits": req.body.FavoriteHits,
            "ReadHits": req.body.ReadHits,
            "LikeHits": req.body.LikeHits,
            "UnlikeHits": req.body.UnlikeHits,
            "Active": req.body.Active,
            "UpdatedAt": req.body.UpdatedAt,
            "Approved": req.body.Approved,
            "ApprovedUserId": req.body.ApprovedUserId,
            "ApprovedAt": req.body.ApprovedAt
        },
        opts
    );

    promise.then((data) => {
        if (!data) {
            next(res.json(response.setError(99, null, 'The article was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.json(response.setError(err.statusCode, err.message, 'Article service error.'));
    });
});

router.delete('/:id', (req, res, next) => {

    const id = req.params.id;

    const promise = Article.remove({ _id: id });

    promise.then((data) => {
        if (!data) {
            next(res.json(response.setError(99, null, 'The article was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.json(response.setError(err.statusCode, err.message, 'Article service error.'));
    });
});



module.exports = router;