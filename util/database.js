const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb) => {
    MongoClient.connect('mongodb+srv://daskousik2223:dk338142@cluster0.jxx4h.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
    .then(client => {
        _db = client.db();
        console.log("Connected");
        cb();
    })
    .catch(err => {
        console.log("Failed to connect");
        throw err;
    });
};

const getDb = () => {
    if(_db){
        return _db;
    }
    throw 'No database Found!!!'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

