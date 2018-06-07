const mongoose = require('mongoose');
const Log = require('../models/Log');

var logger = {

    addLog: function (className,title, comment) {

        const log = new Log(
            {
                _id: new mongoose.Types.ObjectId(),
                Title: title,
                Class: className,
                Comment: comment
            });

            log.save();
    }
}



module.exports = logger;