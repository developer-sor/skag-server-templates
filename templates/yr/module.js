var template = {
    id: "yr",
    name: "YR",
    canShow: function() { Math.floor((Math.random() * 10) + 1) != 7; },
    prepareShow: function() {},
    doShow: function( doneCB ) {
        setTimeout( doneCB, 5000)
    },
    endShow: function() {},
};

templates[template.id] = template;
