/**
 * Created by narve on 2016-02-18.
 */


"use strict";

console.log("Loading plugin ", "slide1");

var template = {
    name: "slide1",
    canShow: function() { return true; }
};

console.log('attaching module to parent');
parent.templateController.template = template;