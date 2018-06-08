const mongoose = require('mongoose');
const config = require('../config');

module.exports = () => {

    if (config.environment === "PROD")
        mongoose.connect('mongodb://admin:aymk2018@ds239930.mlab.com:39930/tiorem', {useMongoClient: true});
    else if (config.environment === "DEV")
        mongoose.connect('mongodb://localhost/tiorem', {useMongoClient: true});

    mongoose.connection.on('open', () => {
        console.log('MongoDB: Connected');
    });
    mongoose.connection.on('error', (err) => {
        console.log('MongoDB: Error', err);
    });

    mongoose.Promise = global.Promise;
};