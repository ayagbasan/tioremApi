const CronJob = require('cron').CronJob;
const request = require('request');
const xml2js = require('xml2js');
const mongoose = require("mongoose");
const Article = require('../models/Article');
const Source = require('../models/Catalogue/Source');
const logger = require('../helper/logger');
const klas = "Batch Jobs - Read Article";
const config = require('../config');


module.exports = () => {

    let readData = function () {

        console.log('job Running', config.environment);

        logger.addLog(klas, "Job started", "Read article jobs started");


        const parser = new xml2js.Parser({explicitArray: false});
        const promise = Source.find({Active: true});

        let totalSource = 0;
        let currentSource = 0;
        let totalReadArticles = 0;
        let totalSavedArticles = 0;
        let totalNotSavedArticle = 0;
        let newsArticle = [];
        promise.then((data) => {
            totalSource = data.length;

            if (totalSource === 0) {
                logger.addLog(klas, "Local sources cannot find", "No any local sources ");
                return;
            }
            data.forEach(source => {

                request("http://nabizapp.com/app/v1.3/android_articles_by_source.php?source_id=" + source.SourceId, function (error, response, body) {
                    //console.log('error:', error); // Print the error if one occurred
                    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    //console.log('body:', body); // Print the HTML for the Google homepage.


                    if (response.statusCode === 200) {

                        parser.parseString(body, function (err, result) {


                            if (!err) {
                                result.xml.articles.article.forEach(element => {

                                    if (element.sourceId != undefined) {


                                        let tmp =
                                            {
                                                _id: new mongoose.Types.ObjectId(),
                                                ArticleId: element.articleId,
                                                SourceId: source._id,
                                                CategoryId: null,
                                                Tags: [],
                                                ArticleUrl: element.articleUrl,
                                                SourceUrl: element.sourceUrl,
                                                Title: element.articleTitle,
                                                SharingTitle: element.articleSharingTitle,
                                                Body: element.articleBody,
                                                PubDate: element.articlePubDate,
                                                DetailedDate: element.articleDetailedDate,
                                                VideoUrl: element.articleVideoUrl,
                                                ImageUrl: element.articleImageUrl,
                                                UpdatedAt: null,
                                                Approved: "Waiting Approve",
                                                ApprovedUserId: null,
                                                ApprovedAt: null
                                            };




                                        totalReadArticles++;
                                    }
                                    else {
                                        //logger.addLog(klas, "Article ID not found", "Article : " + JSON.stringify(element));
                                    }

                                });
                            } else {
                                logger.addLog(klas, "Article can not parse", "XML body : " + body);
                            }

                        });

                        console.log(source.SourceId, " Bitti");

                        logger.addLog(klas, "Source read and saved", "Source Name : " + source.SourceName);
                        currentSource++;
                        if (currentSource === totalSource) {
                            logger.addLog(klas, "Job completed", "Total Read Article: " + totalReadArticles + " Total Saved Articles: " + totalSavedArticles + " Total Not Saved Articles :" + totalNotSavedArticle);
                            //console.log("Total Read Article: " + totalReadArticles + " Total Saved Articles: " + totalSavedArticles + " Total Not Saved Articles :" + totalNotSavedArticle);

                          /*  Article.collection.insert(newsArticle, function (err, docs) {
                                if (err) {
                                    console.error(err);
                                } else {
                                    console.log("Multiple documents inserted to Collection");
                                }
                            });*/
                          job.stop();
                        }
                    } else {
                        logger.addLog(klas, "Source can not read from remote", "Http Response : " + response);
                    }
                });
            });
        }).catch((err) => {

            logger.addLog(klas, "Local sources cannot find", "No any local sources " + err);


        });

    };


    var job = new CronJob({
        cronTime: '00 */10 * * * *',
        onTick: function () {

            console.log("Next Run: ", this.nextDates());
            readData();

        },
        onComplete : function(){
            console.log("job bitti");
        },
        start: true,
        runOnInit: true,
    });

    job.start();
};