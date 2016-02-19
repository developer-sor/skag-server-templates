/**
 * Created by narve on 2016-02-18.
 */


"use strict";

console.log( "Loading plugin ", "dev" );

var template = {
    id: "dev",
    name: "DevTest",
    canShow: function() { return true; },
    prepareShow: function() {},
    doShow: function( doneCB ) {
        setTimeout( doneCB, 5000)
    },
    endShow: function() {},
};

templateController.addTemplate( template );
