
var rendering = require('./util/rendering'),
    indexController = require('./controllers/index'),
    loginController = require('./controllers/login');
    grudioController = require('./controllers/grudio');

module.exports = function (app, passport) {

    // Home
    app.get('/', indexController.home);
    app.get('/home', ensureAuthenticated, indexController.userHome);


    // Auth
    app.get('/register', loginController.registerPage);
    app.post('/register', loginController.registerPost);
    app.get('/login', loginController.loginPage);
    app.post('/login', loginController.checkLogin);
    app.get('/logout', loginController.logout);
    // Auth APIs
    app.post('/registerapi', loginController.registerPostAPI);
    app.post('/loginapi', loginController.checkLoginAPI);
    app.get('/logoutapi', loginController.logoutAPI);

    // Curd Operation
    // app.get('/category', ensureAuthenticated, grudioController.getCategory);
    app.get('/category', grudioController.getCategory);
    app.post('/category', grudioController.postCategory);

    app.post('/song', grudioController.postSongs);
    app.get('/song', grudioController.getSongs);

    app.post('/toggle', grudioController.toggleFeature);

    app.get('/syncPlaylist', grudioController.syncPlaylist);
    app.get('/syncPlayer', grudioController.syncPlayer);

    // 'rendering' can be used to format api calls (if you have an api)
    // into either html or json depending on the 'Accept' request header
    app.get('/apitest', function(req, res) {
        rendering.render(req, res, {
            'data': {
                'test': {
                    'testsub': {
                        'str': 'testsub hello world'
                    },
                    'testsub2': 42
                },
                'test2': 'hello world'
            }
        });
    })


    // Auth Middleware
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/login');
    }
}
