"use strict";
var Grudio = function() {
    this.songInteractionInit();
};
var isLoggedin = true;
var userOnArticleReq = function(feature, featureValue, articleid, url) {
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
    });

    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
    });
};
Grudio.prototype.songInteractionInit = function() {
    var songsList, songs , self;
    var self = this;
    songsList = $('.song-list');
    songs = $(songsList).children('.song-item');
    songs.each(function() {
        self.selectUpvoteButton.call(this, self.upvoted);
        self.selectDownvoteButton.call(this, self.downvoted);
    });
};
Grudio.prototype.selectUpvoteButton = function(upvoted) {
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
        upvoted.call(self, upvoteButton, songid);
    });
};
Grudio.prototype.upvoted = function(upvoteButton, songid) {
    if(!isLoggedin) {
        console.log("show login");
    } else {
        console.log(this.boolUpvote);
        if(!this.boolUpvote) {
            $(upvoteButton).addClass('active');
            this.boolUpvote = true;
            userOnArticleReq('upvote', 1, songid, 'togglefeature');
            console.log('upvoted true');
        } else {
            $(upvoteButton).removeClass('active');
            userOnArticleReq('upvote', 0, songid, 'togglefeature');
            this.boolUpvote = false;
            console.log('upvoted false');
        }
    }
};
Grudio.prototype.selectDownvoteButton = function(downvoted) {
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
        downvoted.call(self, downvoteButton, songid);
    });
};
Grudio.prototype.downvoted = function(downvoteButton, songid) {
    if(!isLoggedin) {
        console.log("show login");
    } else {
        if(!this.boolDownvote) {
            $(downvoteButton).addClass('active');
            this.boolDownvote = true;
            userOnArticleReq('downvote', 1, songid, 'togglefeature');
            console.log('downvote true');
        } else {
            $(downvoteButton).removeClass('active');
            userOnArticleReq('downvote', 0, songid, 'togglefeature');
            this.boolDownvote = false;
            console.log('downvote false');
        }
    }
};

var gr = new Grudio();