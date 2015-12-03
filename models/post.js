// post.js

var mongodb = require('./db');

function Post(post) {
    this.user = post.user;
    this.content = post.content;
    this.time = post.time;
};
module.exports = Post;

Post.prototype.post = function post(callback) {
    // save to Mongodb
    var post = {
        user: this.user,
        content: this.content,
        time: this.time,
    };
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // get posts collection
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            // create or ensure name index
            collection.ensureIndex('user', { unique: false });
            // write post file
            collection.insert(post, { safe: true }, function (err, post) {
                mongodb.close();
                callback(err, post);
            });
        });
    });
};

Post.get = function get(username, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // get users collection
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            // find name is equal to username from users file
            collection.find({ user: username }).sort({ time: -1 }).toArray(function (err, docs) {
                mongodb.close();
                var posts = [];
                if (docs) {
                    // cast to Post objects
                    docs.forEach(function (doc, index) {
                        var post = new Post({user: doc.user, content: doc.content, time: doc.time});
                        posts.push(post);
                    });
                }
                callback(err, posts);
            });
        });
    });
};
