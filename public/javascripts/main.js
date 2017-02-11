"use strict";
_.templateSettings.variable = "rc";
var template = _.template(
    $( ".songs-template" ).html()
);
var isLoggedin = true;
var userOnArticleReq = function(feature, featureValue, articleid, url, fetchDataApi) {
    var dataValue;
    dataValue = {
        song_id : articleid,
    };
    dataValue[feature] = featureValue;
    var request = $.ajax({
        url: "/"+url+"/",
        method: "POST",
        data: dataValue
    });
    request.done(function( msg ) {
      console.log(feature+"success");
      fetchDataApi();
    });

    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
      fetchDataApi();
    });
};

var Grudio = function() {
    this.songsList = $('.song-list');
    this.songs = $(this.songsList).children('.song-item');
    this.songInteractionInit();
};
Grudio.prototype.songInteractionInit = function() {
    var self;
    self = this;
    this.songs.each(function() {
        self.selectUpvoteButton.call(this, self.upvoted, self.fetchDataApi.bind(self));
        self.selectDownvoteButton.call(this, self.downvoted, self.fetchDataApi.bind(self));
    });
};
Grudio.prototype.selectUpvoteButton = function(upvoted, fetchDataApi) {
    var self, upvoteButton, songid, isUpvoted;

    self = this;
    upvoteButton = $(this).find('.upvote');
    songid = $(upvoteButton).data('songid');

    isUpvoted = parseInt($(upvoteButton).data('isupvoted'));
    this.boolUpvote = false;
    if(isUpvoted) {
        $(upvoteButton).addClass('active');
        this.boolUpvote = true;
    }
    $(upvoteButton).on('click', function() {
        upvoted.call(self, upvoteButton, songid, fetchDataApi);
    });
};
Grudio.prototype.upvoted = function(upvoteButton, songid, fetchDataApi) {
    if(!isLoggedin) {
        console.log("show login");
    } else {
        if(!this.boolUpvote) {
            $(upvoteButton).addClass('active');
            this.boolUpvote = true;
            userOnArticleReq('upvote', 1, songid, 'togglefeature', fetchDataApi);
        } else {
            $(upvoteButton).removeClass('active');
            userOnArticleReq('upvote', 0, songid, 'togglefeature', fetchDataApi);
            this.boolUpvote = false;
        }
    }
};
Grudio.prototype.selectDownvoteButton = function(downvoted, fetchDataApi) {
    var downvoteButton, songid, isDownvoted, self;

    self = this;

    downvoteButton = $(this).find('.downvote');
    songid = $(downvoteButton).data('songid');

    isDownvoted = parseInt($(downvoteButton).data('downvoted'));
    this.boolDownvote = false;
    if(isDownvoted) {
        $(downvoteButton).addClass('active');
        this.boolDownvote = true;
    }

    $(downvoteButton).on('click', function() {
        downvoted.call(self, downvoteButton, songid, fetchDataApi);
    });
};
Grudio.prototype.downvoted = function(downvoteButton, songid, fetchDataApi) {
    if(!isLoggedin) {
        console.log("show login");
    } else {
        if(!this.boolDownvote) {
            $(downvoteButton).addClass('active');
            this.boolDownvote = true;
            userOnArticleReq('downvote', 1, songid, 'togglefeature', fetchDataApi);
        } else {
            $(downvoteButton).removeClass('active');
            userOnArticleReq('downvote', 0, songid, 'togglefeature', fetchDataApi);
            this.boolDownvote = false;
        }
    }
};
Grudio.prototype.fetchDataApi = function() {
    var dataValue;
    var self = this;
    dataValue = {
        song_id : 1,
    };
    //dataValue[feature] = featureValue;
    var request = $.ajax({
        url: "http://localhost:8989/syncPlaylist?category=1&user=1",
        method: "GET"
    });
    request.done(function(data) {
      console.log(data);
      self.fillSongTemplate.call(self, data);
      var gr = new Grudio();
    });

    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
    });
};
Grudio.prototype.fillSongTemplate = function(data) {
    var self = this;
    console.log(data);
    //$(this.songsList).html(template);
    $(this.songsList).html(
        template(data)
    );
    console.log('html in progress');
};

var gr = new Grudio();