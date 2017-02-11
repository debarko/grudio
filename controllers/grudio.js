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
  var logged_user = req.user;
  if(logged_user){
    req.app.knexRef.raw('SELECT * FROM songs, user_songs WHERE user_songs.sond_id = songs.id')
    .then(
        function(model){
          result = [];
          for (var i = model[0].length - 1; i >= 0; i--) {
            var id = model[0][i]["id"]; 
            var user_id = model[0][i]["user_id"]; 
            var upvote = model[0][i]["upvote"]; 
            var downvote = model[0][i]["downvote"];

            var already_exist = false;
            var forced = false;

            if(isEmpty(result)){
              result.push(model[0][i]);
            } else{

              if(user_id == req.user.id && (upvote == 1 || downvote == 1)){
                forced = true;
              }
              for (var k = result.length - 1; k >= 0; k--) {
                if(result[k]["id"] == id){
                  if(forced==true){
                    result[k]["upvote"] = upvote;
                    result[k]["downvote"] = downvote;
                  }
                  already_exist  = true;
                }
              }
              if(already_exist == false){
                result.push(model[0][i]);
              }
            }
          }
          res.json(result);
        }, function(err){
          console.log(err);
          res.json(err)
        }
      );
  }
  else{
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

exports.toggleFeature = function(req, res){
  console.log("in toggle");
  user_id = req.user.id;
  // user_id = 1;
  song_id = req.body.id;
  upvote = req.body.upvote;
  downvote = req.body.downvote;
  song_is_playing = req.body.song_is_playing;
  

  req.app.knexRef.raw('SELECT * FROM songs, user_songs WHERE user_songs.sond_id = songs.id AND songs.id = ? AND user_songs.user_id = ? limit 1', [song_id, user_id])
  .then(function(result) {
      
      if(isEmpty(result[0])){
        console.log("in first query2");
        // user actitvity for first time
        if(upvote == 1 || upvote == '1'){
            var udata = {user_id: user_id, sond_id: song_id, upvote:1, downvote: 0}
        } else if(downvote == 1 || downvote == '1'){
            var udata = {user_id: user_id, sond_id: song_id, upvote:0, downvote: 1}
        } else{
            var udata = {user_id: user_id, sond_id: song_id, upvote:0, downvote: 0}
        }
        new grudioModel.userSongsModel(udata).save().then(function(model){
            res.json("Sucessfull")
        }, function(err){
            console.log(err);
            res.end("unable to process request");
        });
      } else{
        // console.log("in else");
        // user has made any change
        // old_upvote = 
        var old_upvote = result[0]['upvote'];
        var old_downvote = result[0]['downvote'];
        if(old_upvote == 1 && (upvote == 1 || upvote == '1')){
            upvote = 0;
        } else if(old_downvote == 1 && (downvote == 1 || downvote == '1')){
            downvote = 0;
        }
        if(old_upvote == 1 && (upvote == 0)){
          // console.log("in else1");
            var sql = "UPDATE user_songs SET upvote = 0 where id = ?";
        } else if(old_downvote == 1 && (downvote == 0)){
          // console.log("in else2");
            var sql = "UPDATE user_songs SET downvote = 0 where id = ?";
        } else if(upvote == 1 || upvote == '1'){
          // console.log("in else3");
          var sql = "UPDATE user_songs SET upvote = 1  where id = ?";
        } else if(downvote == 1 || downvote == '1'){
          // console.log("in else4");
          var sql = "UPDATE user_songs SET downvote = 1 where id = ?";
        } else{
          // console.log("in else5");
          var sql = "UPDATE user_songs SET upvote = 1, downvote = 1 where id = ?";
        }
        req.app.knexRef.raw(sql, [result[0]['id']]).then(function(result){res.json("Sucessfull")}, function(err){res.end(err)});
      }
  }, function(error){
    res.end(error);
  })

}