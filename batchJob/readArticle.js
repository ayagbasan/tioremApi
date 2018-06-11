const CronJob = require('cron').CronJob;
const xml2js = require('xml2js');
const Article = require('../models/Article');
const Source = require('../models/Catalogue/Source');
const logger = require('../helper/logger');
const klas = "Batch Jobs - Read Article";
const config = require('../config');
const request = require('request-promise');
const mongoose = require("mongoose");



let JobArticle = {


    readData: function () {


        console.log('job Running', config.environment);

        logger.addLog(klas, "Job started", "Read article jobs started");


        const parser = new xml2js.Parser({explicitArray: false});
        const promise = Source.find({Active: true});

        const urls = [];

        let localSources = [];
        promise.then((data) => {

            data.forEach(source => {
                localSources.push(source);
                urls.push("http://nabizapp.com/app/v1.3/android_articles_by_source.php?source_id=" + source.SourceId);
            });

            const promises = urls.map(url => request(url));
            Promise.all(promises).then((xmlData) => {
                let readArticles = [];
                console.log("Download bitti");

                for (let i = 0; i < xmlData.length; i++) {
                    parser.parseString(xmlData[i], function (err, result) {

                        if (!err) {
                            for (let j = 0; j < result.xml.articles.article.length; j++) {
                                let item = result.xml.articles.article[i];
                                if (item.sourceId !== undefined && item.articleId != undefined) {
                                    readArticles.push(result.xml.articles.article[j]);
                                } else {
                                    //logger.addLog(klas, "Article ID not found", "Article : " + JSON.stringify(item));

                                }
                            }
                        } else {
                            logger.addLog(klas, "Article can not parse", "XML body : " + body);
                            console.log(klas, "Article can not parse", "XML body : " + body);
                        }
                    });
                }


                return readArticles;

            }).then((list) => {


                let articles = [];
                for (let i = 0; i < list.length; i++) {

                    if (list[i].articleId !== undefined) {


                        let tmp =
                            {
                                _id: new mongoose.Types.ObjectId(),
                                ArticleId: parseInt(list[i].articleId),
                                SourceId: parseInt(list[i].sourceId),
                                CategoryId: null,
                                Tags: [],
                                ArticleUrl: list[i].articleUrl,
                                SourceWebSite: list[i].sourceUrl,
                                Title: list[i].articleTitle,
                                SharingTitle: list[i].articleSharingTitle,
                                Body: list[i].articleBody,
                                PubDate: list[i].articlePubDate,
                                DetailedDate: list[i].articleDetailedDate,
                                VideoUrl: list[i].articleVideoUrl,
                                ImageUrl: list[i].articleImageUrl,
                                UpdatedAt: null,
                                Approved: "Waiting Approve",
                                ApprovedUserId: null,
                                ApprovedAt: null
                            };

                        for (let j = 0; j < localSources.length; j++) {
                            if (localSources[j].SourceId === parseInt(list[i].sourceId)) {
                                tmp.SourceDBId = localSources[j]._id;
                                break;
                            }
                        }

                        articles.push(tmp);

                        // let query = {ArticleId: tmp.ArticleId},
                        //     update = tmp,
                        //     options = {upsert: true, new: true, setDefaultsOnInsert: true};


                        // Article.findOneAndUpdate(query, update, options, function (error, result) {
                        //     if (error) {
                        //         console.log(i);
                        //     } else {
                        //         count++;
                        //     }
                        // });
                    }
                }
                console.log("Articles parsed");
                return articles;


            }).then((list) => {

                var count = 0;
                for (let i = 0; i < list.length; i++) {
                    (function (name_now) {
                            Article.findOne({ArticleId: name_now},
                                function (err, doc) {

                                    if (!err && !doc) {
                                        let newArticle = new Article(list[i]);
                                        newArticle.save(function (err) {
                                            if (!err) {
                                                //logger.addLog(klas, "New article", "New article inserted. Article ID: " + list[i].ArticleId);
                                                count++;
                                            } else {
                                                //logger.addLog(klas, "New article not saved", "New article inserted. Article ID: " + list[i].ArticleId + " Error: " + err);

                                            }

                                        });

                                    } else if (!err) {
                                        //console.log("Person is in the system");

                                    } else {
                                        //console.log("ERROR: " + err);

                                    }

                                    if (i == list.length - 1) {

                                        logger.addLog(klas, "Job Completed", count + " Articles saved");
                                        console.log("Job Completed", count + " Articles saved");
                                    }
                                }
                            )
                        }
                    )(list[i].ArticleId);
                }


            });

        }).catch((err) => {

            logger.addLog(klas, "Local sources cannot find", "No any local sources " + err);

        });

    },



};


new CronJob({
    cronTime: '00 */10 * * * *',
    onTick: function () {

        console.log("Next Run: ", this.nextDates());
        JobArticle.readData();

    },
    onComplete: function () {
        console.log("job bitti");
    },
    start: true,
    runOnInit: true,
});

module.exports = JobArticle;