var rendering = require('../util/rendering');


exports.home = function(req, res) {
    res.end('this is logged out');
}


exports.userHome = function(req, res) {
    res.end('this is logged in');
}
