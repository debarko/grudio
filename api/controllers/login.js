var crypto = require('crypto'),
    passport = require('passport'),
    data = require('../models/auth')();


exports.registerPost = function(req, res) {
    var vpw = req.body.vpw;
    var pwu = req.body.pw;
    var un = req.body.un;
    
    if(vpw !== pwu) {
        res.end('error', 'Your passwords did not match.');
        return;
    }

    req.checkBody('un', 'Please enter a valid email.').notEmpty().isEmail();
    var errors = req.validationErrors();
    if (errors) {
        var msg = errors[0].msg;
        res.end('error', msg);
        return;
    }
    
    var new_salt = Math.round((new Date().valueOf() * Math.random())) + '';
    var pw = crypto.createHmac('sha1', new_salt).update(pwu).digest('hex');
    var created = new Date().toISOString().slice(0, 19).replace('T', ' ');

    new data.ApiUser({email: un, password: pw, salt: new_salt, created: created}).save().then(function(model) {
        passport.authenticate('local')(req, res, function () {
            res.end('success');
        })
    }, function(err) {
        res.end('error');
    });
}


exports.checkLogin = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err || !user) {
            res.end('error');
            return;
        }
        req.logIn(user, function(err) {
            if (err) {
                res.end('error');
                return res.redirect('/login');
            }
            res.semd('bahar');
            return;
        });
    })(req, res, next);
}


exports.logout = function(req, res) {
    req.logout();
}
