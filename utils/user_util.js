// user_util.js

function user_util() {
}

user_util.prototype.getloginUser = function getloginUser(req) {
    return req.session.user;
};
user_util.prototype.requireAuthentication = function requireAuthentication(req, res, next) {
    var shouldAuthentication =
        req.path != "/" &&
        req.path != "/login" &&
        req.path != "/register" &&
        req.path != "/favicon.ico" &&
        req.path != "/javascripts/bootstrap.js" &&
        req.path != "/javascripts/bootstrap.min.js" &&
        req.path != "/javascripts/jquery-2.1.4.js" &&
        req.path != "/stylesheets/bootstrap.css" &&
        req.path != "/stylesheets/bootstrap.min.css" &&
        req.path != "/stylesheets/bootstrap-responsive.css" &&
        req.path != "/stylesheets/bootstrap-responsive.min.css" &&
        req.path != "/stylesheets/style.css" &&
        req.path != "/images/glyphicons-halflings.png" &&
        req.path != "/images/glyphicons-halflings-white.png";
    if (shouldAuthentication && !this.getloginUser(req)) {
        return res.redirect(302, '/login');
    }
    else
    {
        next();
    }
};

module.exports = user_util;
