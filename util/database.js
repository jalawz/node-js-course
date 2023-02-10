const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb://127.0.0.1:27017')
    .then(result => {
        console.log('Connected!');
        callback(result);
    })
    .catch(err => console.error(err));
};

module.exports = mongoConnect;