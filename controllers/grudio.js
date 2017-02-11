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
    req.app.knexRef.raw('SELECT songs.id as id, songs.name as name, songs.url as song_url, songs.upvote_count as upvotes, songs.downvote_count as downvotes, user_songs.upvote as user_upvote, user_songs.downvote as user_downvote  FROM songs left join user_songs on user_songs.sond_id = songs.id and user_songs.user_id = ? where songs.category_id=? order by songs.upvote_count DESC, songs.downvote_count ASC limit 20', [req.query.user, req.query.category])
    .then(function(result) {
        res.json(result[0]);
    })
    .catch(function(error) {
        res.end(error);
    });
}

function nextSong(req, cb) {
    req.app.knexRef.raw('SELECT songs.id as id, songs.name as name, songs.url as song_url, songs.file_path as file_path, songs.upvote_count as upvotes, songs.downvote_count as downvotes, user_songs.upvote as user_upvote, user_songs.downvote as user_downvote  FROM songs left join user_songs on user_songs.sond_id = songs.id and user_songs.user_id = ? where songs.category_id=? order by songs.upvote_count DESC, songs.downvote_count ASC limit 20', [req.query.user, req.query.category])
    .then(function(result) {
        cb(result[0]);
    })
    .catch(function(error) {
        cb('error');
    });
}

function updateCatCache(req, category, song_id, seek) {
    if (!category) {
        category = req.query.category;
    }
    if (!seek) {
        seek = 0;
    }
    var milliseconds = (new Date).getTime();
    console.log(song_id);
    var obj = {
        song: song_id,
        time: milliseconds,
        seek: 0
    };
    console.log(JSON.stringify(obj));
    req.app.memcacheRef.set(category, JSON.stringify(obj), 86400);
    console.log(req.app.memcacheRef.get(category))
}

function givemeObject(song) {
    return {song_url: song.song_url,seek: 0, name: song.name, file_path: song.file_path};
}

exports.syncPlayer = function(req, res) {
    var catCache = req.app.memcacheRef.get(req.query.category);
    console.log(1);
    console.log(catCache);
    if (catCache) {
        console.log(3);
        catCache = JSON.parse(catCache);
        var milliseconds = (new Date).getTime();
        var timeDiff = milliseconds - catCache.time;
        timeDiff = timeDiff / 1000;
        nextSongs = nextSong(req, function (songs) {
            console.log(4);
            var songDiff = timeDiff/(5*60);
            var songDiffCheck = timeDiff/(5*60);
            for(var i =0; i < songs.length; i++) {
                if(songs[i].id === catCache.song) {
                    songDiff += i;
                }
            }
            if (songDiff === songDiffCheck) {
                songDiff = songs.length + 1;
            }
            if (songDiff > songs.length) {
                res.json(givemeObject(songs[0]));
            } else {
                res.json(givemeObject(songs[songDiff]));
            }
        });
    } else {
        console.log(2);
        nextSong(req, function (songs) {
            console.log(21);
            updateCatCache(req, undefined, songs[0].id);
            res.json(givemeObject(songs[0]));
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

