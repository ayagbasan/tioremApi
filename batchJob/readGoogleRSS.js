const CronJob = require('cron').CronJob;
const xml2js = require('xml2js');
const logger = require('../helper/logger');
const klas = "GoogleNewRSS";
const config = require('../config');
const mongoose = require("mongoose");
const GoogleNews = require('../models/GoogleNews');
let Parser = require('rss-parser');
let parser = new Parser();

let JobGoogleRSS = {


    readData: () => {

        (async () => {

            let feed = await parser.parseURL('https://news.google.com/rss?ned=tr_tr&gl=TR&hl=tr');
            console.log(feed.title);

            var count = 0;
            for (let i = 0; i < feed.items.length; i++) {
                (function (_title, _clusterId) {

                        console.log((_title, _clusterId));
                        GoogleNews.findOne({title: _title, clusterId: _clusterId},
                            function (err, doc) {

                                if (!err && !doc) {
                                    let newNews = new GoogleNews(feed.items[i]);
                                    newNews.clusterId = JobGoogleRSS.getClusterId(newNews.guid);
                                    newNews._id = new mongoose.Types.ObjectId();
                                    newNews.save(function (err) {
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

                                if (i == feed.items.length - 1) {

                                    logger.addLog(klas, "Job Completed", count + " RSS Feeds saved");
                                    console.log("Job Completed", count + " RSS Feeds saved");
                                }
                            }
                        )
                    }
                )(feed.items[i].title, JobGoogleRSS.getClusterId(feed.items[i].guid));
            }

        })();

    },

    getClusterId: (guid) => {

        if (guid.indexOf("=") > -1) {
            let res = guid.split("=");
            if (res.length > 0)
                return res[res.length - 1];
            else
                return guid;
        }
        else
            return guid;

    }


};


new CronJob({
    cronTime: '00 */1 * * * *',
    onTick: function () {

        console.log("Next Run: ", this.nextDates());
        JobGoogleRSS.readData();

    },
    onComplete: function () {
        console.log("job bitti");
    },
    start: true,
    runOnInit: true,
});

module.exports = JobGoogleRSS;