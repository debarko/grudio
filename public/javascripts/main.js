"use strict";
var Grudio = function() {
    this.songInteractionInit();
};
Grudio.prototype.songInteractionInit = function() {
    var songsList, songs , self;
    var self = this;
    songsList = $('.song-list');
    songs = $(songsList).children('.song-item');
    songs.each(function() {
        console.log(this);
    });
};
Grudio.prototype.selectIntractionButton = function() {

};

var gr = new Grudio();