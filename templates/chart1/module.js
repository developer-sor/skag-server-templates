﻿/**
 * Created by narve on 2016-02-18.
 */


"use strict";

console.log("Loading plugin ", "intro");

var template = {
    id: "chart1",
    defaultTimeOut: 4000,
    name: "Chart1",
    //canShow: function() { return true; },
    prepareShow: function () { },
    doShow: function (doneCB) {
        console.log("Showing ", this.name, ", cb: ", doneCB);
        setTimeout(doneCB, 5000)
    },
    endShow: function () { },
};

templateController.addTemplate(template);