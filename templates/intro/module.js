﻿/**
 * Created by narve on 2016-02-18.
 */


"use strict";

console.log("Loading plugin ", "intro");

var template = {
    name: "intro",
    canShow: function() { return true; }
};

console.log('attaching module to parent');
parent.templateController.template = template;