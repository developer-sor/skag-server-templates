console.log( "Loading plugin ", "yr" );
var template = {
    id: "yr",
    name: "YR",
    defaultTimeOut: 10000,
    //canShow: function() { Math.floor((Math.random() * 10) + 1) != 7; },
    prepareShow: function() {},
    doShow: function( doneCB ) {
        setTimeout( doneCB, 5000)
    },
    endShow: function() {},
};

templateController.addTemplate( template );
