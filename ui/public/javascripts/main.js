"use strict";
var Grudio = function() {
    console.log("Grudio init");
    this.testMethod();
};
Grudio.prototype.testMethod = function() {
    console.log("test method called");
};

var gr = new Grudio();