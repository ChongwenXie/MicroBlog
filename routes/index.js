var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var user_util = require('../utils/user_util');
var user = require('../models/user');
var post = require('../models/post');

var user_util_obj = new user_util();

router.all('*', function (req, res, next) {
        user_util_obj.requireAuthentication(req, res, next);
});

router.get('/', function (req, res, next) {
    if (!!req.session.user) {
        var posts;
        post.get(req.session.user.name, function (err, posts) {
            res.render('index', { title: 'home', user: req.session.user, posts: posts });
        });
    }
    else {
        res.render('index', { title: 'home', user: req.session.user, posts: [] });
    }
});

router.get('/login', function (req, res, next) {
    res.render('login', { title: 'login', user: req.session.user });
});
router.post('/login', function (req, res, next) {
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    user.get(req.body.username, password, function (err, user) {
        if (err) {
            req.flash('error', err);
            res.redirect('/login');
        }
        req.session.user = user;
        req.flash('success', 'log in succeeds.');
        res.redirect('/');
    });
});

router.get('/register', function (req, res, next) {
    res.render('register', { title: 'register', user: req.session.user });
});
router.post('/register', function (req, res, next) {
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var new_user = new user({ name: req.body.username, password: password });
    new_user.post(function (err, user) {
        if (err) {
            req.flash('error', err);
            res.redirect('/register');
        }
        req.session.user = new_user;
        req.flash('success', 'Register succeeds.');
        res.redirect('/');
    });
});
router.get('/user/:id', function (req, res, next) {
    res.render('user_home_page', { title: req.params.id, user: req.session.user });
});
router.post('/blog', function (req, res, next) {
    var currentUser = req.session.user;
    var new_post = new post({ user: currentUser.name, content: req.body.post, time: new Date() });
    new_post.post(function (err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success', 'Blog posts succeeds.');
        res.redirect('/');
        //res.redirect('/u/' + currentUser.name);
    });
});

router.get('/logoff', function (req, res, next) {
    req.session.user = null;
    req.flash('success', 'Log off succeeds.');
    res.redirect('/');
});

router.login_url = '/login';

module.exports = router;
