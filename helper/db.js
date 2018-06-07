const mongoose = require('mongoose');

module.exports = () => {

    mongoose.connect('mongodb://admin:aymk2018@ds239930.mlab.com:39930/tiorem', { useMongoClient: true });
    //mongoose.connect('mongodb://localhost/tiorem', { useMongoClient: true});
    //mongoose.connect('mongodb://admin:admin@185.86.6.169:27017/aymkCoin', { useMongoClient: true});

    mongoose.connection.on('open', () => {
        console.log('MongoDB: Connected');
    });
    mongoose.connection.on('error', (err) => {
        console.log('MongoDB: Error', err);
    });

    mongoose.Promise = global.Promise;
};