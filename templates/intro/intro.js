/**
 * Created by narve on 2016-02-18.
 */

$(function () {

    console.log( "Showing/loading: intro");

    var source = $("#entry-template").html();

    //console.log("Handlebars template: ", source);

    var template = Handlebars.compile(source);

    var html = template(installation);

    //console.log("Intro: ", $("#intro").size());

    $("#intro").html(html);

    //console.log("did handlebars stuff", html);

});

