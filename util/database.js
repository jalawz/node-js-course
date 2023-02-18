const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb://paulo:penha269@127.0.0.1:27017')
    .then(client => {
        console.log('Connected!');
        _db = client.db('node_complete');
        callback();
    })
    .catch(err => {
        console.error(err);
        throw err;
    });
};

const getDb = () => {
    if (_db) {
        return _db
    }
    throw 'No database found!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;