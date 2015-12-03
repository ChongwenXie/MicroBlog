// db.js

var settings = require("../settings.js");
var db = require("mongodb").Db;
//var connection = require("mongodb").Connection;
var server = require("mongodb").Server;

module.exports = new db(settings.db, new server(settings.host, 27017, {}));
