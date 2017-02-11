"use strict";
var template = _.template(
    $( ".songs-template" ).html()
);
var isLoggedin = true;
var userOnArticleReq = function(feature, featureValue, articleid, url, fillSongTemplate) {
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
      //fillSongTemplate();
      //var gr = new Grudio();
    });

    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
      //fillSongTemplate();
      //var gr = new Grudio();
    });
};

var Grudio = function() {
    this.songsList = $('.song-list');
    this.songs = $(this.songsList).children('.song-item');
    console.log(this.songs);
    this.songInteractionInit();
};
Grudio.prototype.songInteractionInit = function() {
    var self;
    self = this;
    console.log(this.songs);
    this.songs.each(function() {
        self.selectUpvoteButton.call(this, self.upvoted, self.fillSongTemplate.bind(self));
        self.selectDownvoteButton.call(this, self.downvoted, self.fillSongTemplate.bind(self));
    });
};
Grudio.prototype.selectUpvoteButton = function(upvoted, fillSongTemplate) {
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
        upvoted.call(self, upvoteButton, songid, fillSongTemplate);
    });
};
Grudio.prototype.upvoted = function(upvoteButton, songid, fillSongTemplate) {
    if(!isLoggedin) {
        console.log("show login");
    } else {
        if(!this.boolUpvote) {
            $(upvoteButton).addClass('active');
            this.boolUpvote = true;
            userOnArticleReq('upvote', 1, songid, 'togglefeature', fillSongTemplate);
        } else {
            $(upvoteButton).removeClass('active');
            userOnArticleReq('upvote', 0, songid, 'togglefeature', fillSongTemplate);
            this.boolUpvote = false;
        }
    }
};
Grudio.prototype.selectDownvoteButton = function(downvoted, fillSongTemplate) {
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
        downvoted.call(self, downvoteButton, songid, fillSongTemplate);
    });
};
Grudio.prototype.downvoted = function(downvoteButton, songid, fillSongTemplate) {
    if(!isLoggedin) {
        console.log("show login");
    } else {
        if(!this.boolDownvote) {
            $(downvoteButton).addClass('active');
            this.boolDownvote = true;
            userOnArticleReq('downvote', 1, songid, 'togglefeature', fillSongTemplate);
        } else {
            $(downvoteButton).removeClass('active');
            userOnArticleReq('downvote', 0, songid, 'togglefeature', fillSongTemplate);
            this.boolDownvote = false;
        }
    }
};
Grudio.prototype.fillSongTemplate = function() {
    var self = this;
    $(this.songsList).html(template);
    console.log('html in progress');
};

var gr = new Grudio();