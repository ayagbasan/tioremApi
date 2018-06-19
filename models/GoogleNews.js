const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var GoogleNewsSchema = new Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        title: {
            type: String,
        },
        link: {
            type: String,
        },
        clusterId : {
            type: String,
        },
        guid : {
            type: String,
        },
        category: {
            type: String,
        },

        pubDate: {
            type: String,
        },
        description: {
            type: String,
        },
        createdAt:
            {
                type: Date,
                default: Date.now
            },

    }
);


module.exports = mongoose.model('GoogleNews', GoogleNewsSchema);