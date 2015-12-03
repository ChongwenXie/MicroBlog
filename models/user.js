// user.js

var mongodb = require('./db');

function User(user) {
    this.name = user.name;
    this.password = user.password;
};
module.exports = User;

User.prototype.post = function post(callback) {
    // save to Mongodb
    var user = {
        name: this.name,
        password: this.password,
    };
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // get users collection
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            // create or ensure name index
            collection.ensureIndex('name', { unique: true });
            // write user file
            collection.insert(user, { safe: true }, function (err, user) {
                mongodb.close();
                callback(err, user);
            });
        });
    });
};

User.get = function get(username, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // get users collection
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            // find name is equal to username from users file
            collection.findOne({ name: username }, function (err, doc) {
                mongodb.close();
                if (doc) {
                    // cast to User object
                    var user = new User(doc);
                    callback(err, user);
                } else {
                    callback(err, null);
                }
            });
        });
    });
};

User.get = function get(username, password, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // get users collection
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            // find name is equal to username from users file
            collection.findOne({ name: username }, function (err, doc) {
                mongodb.close();
                if (doc) {
                    // cast to User object
                    var user = new User(doc);
                    if (user.password == password)
                    {
                        callback(err, user);
                    }
                    else
                    {
                        err = "password is wrong.";
                        callback(err, user);
                    }
                } else {
                    callback(err, null);
                }
            });
        });
    });
};
