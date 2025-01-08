const mongoose = require('mongoose');

async function connectMongoDB (url) {
    return mongoose.connect(url)
};

//Exporting
module.exports = {
    connectMongoDB
}