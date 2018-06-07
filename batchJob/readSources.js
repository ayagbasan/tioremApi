const request = require('request');
const xml2js = require('xml2js');
const mongoose = require("mongoose");
const Source = require('../models/Catalogue/Source');

module.exports = () => {

    const parser = new xml2js.Parser({ explicitArray: false });




    request('https://nabizapp.com/app/v1.3/android_all_categories.php', function (error, response, body) {


        parser.parseString(body, function (err, result) {

            console.log(result.xml.categories.category.length, "Category");

            var remoteSources = [];

            let root = result.xml.categories.category;

            for (let i = 0; i < root.length; i++) {
                if (Array.isArray(root[i].subCategories.subCategory)) {
                    let cat1 = root[i].subCategories.subCategory;

                    cat1.forEach(element => {

                        if (Array.isArray(element.sources.source)) {

                            element.sources.source.forEach(source => {
                                remoteSources.push(source);
                            });
                        } else {
                            remoteSources.push(element.sources.source);
                        }
                    });
                } else {
                    let sources = root[i].subCategories.subCategory.sources.source;

                    sources.forEach(element => {
                        remoteSources.push(element);
                    });
                }


            }

            let localSource = [];
            remoteSources.forEach(s => {
                let body =
                    {
                        _id: new mongoose.Types.ObjectId(),
                        SourceName: s.sourceName,
                        Description: s.sourceDescription.length>1?s.sourceDescription[0]:"",
                        ImageUrl: s.sourceImageUrl,
                        SourceUrl: s.sourceUrl,
                        SourceId: parseInt(s.sourceId),
                        Active:false
                    }

                localSource.push(new Source(body));
            });


            //Source.collection.remove({});
            Source.collection.insert(localSource, function (err, docs) {
                if (err) {
                    return console.error(err);
                } else {
                    console.log("Multiple documents inserted to Collection");
                }
            });
        });









    });
};