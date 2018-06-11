const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const response = require('../models/Response');

const Article = require('../models/Article');
const Source = require('../models/Catalogue/Source');
const Tag = require('../models/Catalogue/Tag');
const jobArticles = require("../batchJob/readArticle");

router.get('/test', (req, res, next) => {
    try {
        res.json(response.setSuccess("Selamün aleyküm"));
    }
    catch (err) {
        res.status(400).json(response.setError(err.statusCode, err.message, 'Article service error.'));
    }
    ;
});

router.post('/', (req, res, next) => {

    req.body._id = new mongoose.Types.ObjectId();
    const article = new Article(req.body);
    const promise = article.save();

    promise.then((data) => {

        res.json(response.setSuccess(data));

    }).catch((err) => {

        res.status(400).json(response.setError(err.statusCode, err.message, 'Article service error.'));
    });
});

router.get('/', (req, res, next) => {


    const promise = Article.aggregate([
        {
            $lookup:
                {
                    from: "categories",       // other table name
                    localField: "CategoryId",   // name of users table field
                    foreignField: "_id", // name of userinfo table field
                    as: "Category"         // alias for userinfo table
                }
        },
        {
            $unwind:
                {
                    path: "$Category",
                    preserveNullAndEmptyArrays: true
                }
        },
        {
            $lookup:
                {
                    from: "sources",       // other table name
                    localField: "SourceId",   // name of users table field
                    foreignField: "SourceId", // name of userinfo table field
                    as: "Source"         // alias for userinfo table
                }
        },
        {
            $unwind:
                {
                    path: "$Source",
                    preserveNullAndEmptyArrays: true
                }
        },
        {$sort: {"PubDate": -1}},
        {
            $project:
                {
                    _id: 1,
                    Active: 1,
                    Approved: 1,
                    ApprovedAt: 1,
                    ApprovedUserId: 1,
                    ArticleId: 1,
                    ArticleUrl: 1,
                    CategoryName: "$Category.CategoryName",
                    CreatedAt: 1,
                    FavoriteHits: 1,
                    ImageUrl: 1,
                    PubDate: 1,
                    Title: 1,
                    UpdatedAt: 1,
                    SourceName: "$Source.SourceName",
                    SourceWebSite: "$Source.SourceWebSite",
                    SourceImageUrl: "$Source.ImageUrl",
                }
        }


    ]);


    promise.then((data) => {
        if (data.length === 0) {
            res.status(400).json(response.setError(99, null, 'Article list is empty'));
        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.status(400).json(response.setError(err.statusCode, err.message, 'Article service error.'))

    });
});

router.get('/:page/:limit', (req, res, next) => {


    const promise = Article.find({}, {Body: 0}).sort({CreatedAt: -1}).skip(req.param.page).limit(req.param.limit);

    promise.then((data) => {
        if (data.length === 0) {
            res.status(400).json(response.setError(99, null, 'Article list is empty'));
        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.status(400).json(response.setError(err.statusCode, err.message, 'Article service error.'))

    });
});


router.get('/:id', (req, res, next) => {

    const promise = Article.findById(req.params.id).populate('Tags.TagId').populate('CategoryId').populate('SourceDBId')

    promise.then((data) => {
        if (!data) {

            res.status(400).json(response.setError(99, null, 'The article was not found.'));

        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.status(400).json(response.setError(err.statusCode, err.message, 'Article service error.'))

    });
});

router.put('/:id', (req, res, next) => {
    console.log(req.params.id, req.body);
    let opts = {runValidators: true, new: true};

    const promise = Article.findOneAndUpdate(
        {
            _id: req.params.id
        },
        {
            "SourceId": req.body.SourceId,
            "CategoryId": req.body.CategoryId,
            "Tags": req.body.Tags,
            "ArticleUrl": req.body.ArticleUrl,
            "SourceWebSite": req.body.SourceUrl,
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
            res.status(400).json(response.setError(99, null, 'The article was not found.'));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.status(400).json(response.setError(err.statusCode, err.message, 'Article service error.'));
    });
});

router.delete('/:id', (req, res, next) => {

    const id = req.params.id;

    const promise = Article.remove({_id: id});

    promise.then((data) => {
        if (!data) {
            res.status(400).json(response.setError(99, null, 'The article was not found.'));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.status(400).json(response.setError(err.statusCode, err.message, 'Article service error.'));
    });
});

// add new tag to article
router.post('/addTag', (req, res, next) => {

    let articleId = new mongoose.Types.ObjectId(req.body.ArticleId);
    let opts = {runValidators: true, new: true};


    const promise = Article.findOneAndUpdate(
        {_id: articleId, "Tags.TagId": {$ne: req.body.TagId._id}},
        {$push: {Tags: req.body}},
        opts
    );

    promise.then((data) => {
        if (data === null) {
            res.status(400).json(response.setError(99, null, 'Eklemek istediğiniz tag Haberin Taglerinde mevcut.'));
        } else {
            res.json(response.setSuccess(data.Tags));
        }
    }).catch((err) => {
        res.status(400).json(response.setError(err.statusCode, err.message, 'Article service error.'));
    });
});

//delete tag from article
router.post('/deleteTag/', (req, res, next) => {

    console.log(req.body);
    let opts = {runValidators: true, new: true};
    const promise = Article.findByIdAndUpdate(
        {_id: req.body.ArticleId},
        {$pull: {'Tags': {TagId: req.body.TagId}}},
        opts
    );

    promise.then((data) => {
        if (!data) {
            res.status(400).json(response.setError(99, null, 'The article was not found.'));
        } else {
            res.json(response.setSuccess(data.Tags));
        }
    }).catch((err) => {
        res.status(400).json(response.setError(err.statusCode, err.message, 'Article service error.'));
    });
});

router.post('/runBatchJob/', (req, res, next) => {


    jobArticles.readData();
    res.json(response.setSuccess("Article Job Completed"));


});



module.exports = router;