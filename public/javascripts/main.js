"use strict";
var Grudio = function() {
    this.songInteractionInit();
};
var isLoggedin = true;
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
    var upvoteButton, songid;

    upvoteButton = $(this).find('.upvote');
    songid = $(upvoteButton).data('songid');

    $(upvoteButton).on('click', function() {
        upvoted.call(self, songid);
    });
};
Grudio.prototype.upvoted = function(songid) {
    if(!isLoggedin) {
        console.log("show login");
    } else {
        console.log(songid);
    }
};
Grudio.prototype.selectDownvoteButton = function(downvoted) {
    var downvoteButton, songid;

    downvoteButton = $(this).find('.downvote');
    songid = $(downvoteButton).data('songid');

    $(downvoteButton).on('click', function() {
        downvoted.call(self, songid);
    });
};
Grudio.prototype.downvoted = function(songid) {
    if(!isLoggedin) {
        console.log("show login");
    } else {
        console.log(songid);
    }
};

var gr = new Grudio();