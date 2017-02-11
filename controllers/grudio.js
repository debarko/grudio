var grudioModel = require('../models/grudiomodel')();


/**
  @PARAMS OBJ 
  Objective: check whether object is empty or not
**/
var hasOwnProperty = Object.prototype.hasOwnProperty;
function isEmpty(obj) {

  if (obj == null) return true;
  if (obj.length > 0)    return false;
  if (obj.length === 0)  return true;    
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }
  return true;
}

exports.getCategory = function(req, res) {
    new grudioModel.categoryModel().fetchAll()
      .then(function(catdata) {
          // console.log(catdata);
          var result = [];
          catdata.forEach(function (model) {
            console.log(model.attributes)
              result.push(model.attributes);
          }) 
          res.json(result);
      })
      .catch(function(err) {
          res.json(err);
      })
}

exports.postCategory = function(req, res) {
    var catName = req.body.name;
    new grudioModel.categoryModel({name: catName}).save().then(function(model){
        res.json("Added")
    }, function(err){
        console.log(err);
        res.json("unable to process request");
    });
}

exports.postSongs = function(req, res) {
  var songName = req.body.name;
  var category = req.body.category;    // might be changed
  var url      = req.body.url;
  var user_id  = req.user.id;                    // hardcode needs to be changed
  if(isEmpty(songName) || isEmpty(category) || isEmpty(url)){
    res.json("either name or category, or url is missing");
  }
  new grudioModel.songsModel({name: songName, category_id: category, url: url, user_id: user_id}).save().then(function(model){
    res.json("Added")
  }, function(err){
    console.log(err);
    res.json("unable to process request");
  })
}

exports.getSongs = function(req, res) {
  var category = req.body.category;
  new grudioModel.songsModel({category_id: category}).fetchAll()
    .then(function(catdata) {
        // console.log(catdata);
        var result = [];
        catdata.forEach(function (model) {
          // console.log(model.attributes)
            result.push(model.attributes);
        }) 
        res.json(result);
    })
    .catch(function(err) {
        res.json(err);
    })
}

exports.syncPlaylist = function(req, res) {
    req.app.knexRef.raw('SELECT * FROM users')
    .then(result => {
        console.log(result);
    }, error => {
        console.log(error);
    });
    res.end('yoyo')
}

exports.syncPlayer = function(req, res) {
}