/**
 * Created by narve on 2016-02-18.
 */


"use strict";

console.log("Loading plugin ", "chart2");

var template = {
    id: "chart2",
    defaultTimeOut: 40000,
    name: "Chart2",
    //canShow: function() { return true; },
    prepareShow: function () { },
    doShow: function (doneCB) {
        console.log("Showing ", this.name, ", cb: ", doneCB);
        setTimeout(doneCB, 50000)
    },
    endShow: function () { },
};

templateController.addTemplate(template);
