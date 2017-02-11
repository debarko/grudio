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
    req.app.knexRef.raw('SELECT songs.name as name, songs.url as song_url, songs.upvote_count as upvotes, songs.downvote_count as downvotes, user_songs.upvote as user_upvote, user_songs.downvote as user_downvote  FROM songs left join user_songs on user_songs.sond_id = songs.id and user_songs.user_id = ? where songs.category_id=? order by songs.upvote_count DESC, songs.downvote_count ASC limit 20', [req.query.user, req.query.category])
    .then(function(result) {
        res.json(result[0]);
    })
    .catch(function(error) {
        res.end(error);
    });
}

function nextSong(req, cb) {
    req.app.knexRef.raw('SELECT songs.name as name, songs.url as song_url, songs.upvote_count as upvotes, songs.downvote_count as downvotes, user_songs.upvote as user_upvote, user_songs.downvote as user_downvote  FROM songs left join user_songs on user_songs.sond_id = songs.id and user_songs.user_id = ? where songs.category_id=? order by songs.upvote_count DESC, songs.downvote_count ASC limit 20', [req.query.user, req.query.category])
    .then(function(result) {
        cb(result[0][0]);
    })
    .catch(function(error) {
        cb('error');
    });
}

function updateCatCache(req, category, song) {
    if (!category) {
        category = req.query.category;
    }
    var milliseconds = (new Date).getTime();
    var obj = {
        song: song,
        time: milliseconds
    };
    req.app.memcacheRef.set(category, JSON.stringify(obj), 86400);
}

exports.syncPlayer = function(req, res) {
    var catCache = req.app.memcacheRef.get(req.query.category);
    if (catCache) {

    } else {
        nextSong(req, function (song) {
            updateCatCache(req, undefined, song.id);
        });
    }
}

function resetSong(id, req, cb) {
    req.app.knexRef.raw('update songs set songs.upvote_count = 0 where id = ?', [id])
    .then(function(result) {
        cb('success');
    })
    .catch(function(error) {
        cb('error');
    });
}

