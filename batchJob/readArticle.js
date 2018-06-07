const CronJob = require('cron').CronJob;
const request = require('request');
const xml2js = require('xml2js');
const mongoose = require("mongoose");
const Article = require('../models/Article');
const Source = require('../models/Catalogue/Source');
const logger = require('../helper/logger');
const klas = "Batch Jobs - Read Article";

module.exports = () => {
    
    var readData = function () { 
        console.log('job Running');

        logger.addLog(klas, "Job started", "Read article jobs started");


        const parser = new xml2js.Parser({ explicitArray: false });
        const promise = Source.find({ Active: true });

        let totalSource = 0;
        let currentSource = 0;
        promise.then((data) => {
            totalSource = data.length;

            if(totalSource===0)
            {
                logger.addLog(klas, "Local sources cannot find", "No any local sources ");
                return;
            }
            data.forEach(source => {

                request("https://nabizapp.com/app/v1.3/android_articles_by_source.php?source_id=" + source.SourceId, function (error, response, body) {
                    //console.log('error:', error); // Print the error if one occurred
                    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    //console.log('body:', body); // Print the HTML for the Google homepage.

                    if (response.statusCode === 200) {

                        parser.parseString(body, function (err, result) {


                            if (!err) {
                                result.xml.articles.article.forEach(element => {

                                    if (element.sourceId != undefined) {

                                        let s =
                                            {
                                                _id: new mongoose.Types.ObjectId(),
                                                ArticleId: element.articleId,
                                                SourceId: source._id,
                                                CategoryId: null,
                                                Tags: [],
                                                ArticleUrl: element.articleUrl,
                                                SourceUrl: element.articleUrl,
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

                                        delete s._id;

                                        var modelDoc = new Article(s);

                                        Article.findOneAndUpdate(
                                            { ArticleId: s.ArticleId }, // find a document with that filter
                                            modelDoc, // document to insert when nothing was found
                                            { upsert: true, new: true, runValidators: true }, // options
                                            function (err, doc) { // callback
                                                if (err) {
                                                    logger.addLog(klas, "Article not saved", "Source Id:" + source.SourceId + " Article Id:" + s.ArticleId + " - " + err);
                                                } else {
                                                    //console.log("article upserted");
                                                }
                                            }
                                        );
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
                            logger.addLog(klas, "Job completed", "Job completed");
                        }
                    } else {
                        logger.addLog(klas, "Source can not read from remote", "Http Response : " + response);

                    }
                });
            });
        }).
            catch((err) => {

                logger.addLog(klas, "Local sources cannot find", "No any local sources " + err);

            });

    };


    var job = new CronJob({
        cronTime: '00 */5 * * * *',
        onTick: function () {

            console.log("Next Run: ", this.nextDates() );
            readData();
        },
        start: true,
        runOnInit :true,
    });

    job.start();
};