var rendering = require('../util/rendering');


exports.home = function(req, res) {
    res.render('index/index');
}


exports.userHome = function(req, res) {
	console.log(req.user.attributes.email);
    res.render('index/user-home');
}
