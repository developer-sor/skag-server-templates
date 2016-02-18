/**
 * Created by narve on 2016-02-18.
 */


"use strict";

console.log( "Loading plugin ", "intro.js" );

var template = {
    id: "intro",
    defaultTimeOut: 1000,
    name: "Forside",
    //canShow: function() { return true; },
    prepareShow: function() {},
    doShow: function( doneCB ) {
        console.log( "Showing ", this.name, ", cb: ", doneCB);
        setTimeout( doneCB, 5000)
    },
    endShow: function() {},
};

templates[template.id] = template;
