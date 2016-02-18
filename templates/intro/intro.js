/**
 * Created by narve on 2016-02-18.
 */

console.log("Intro initializing, handlebars=", Handlebars);

$(function () {

    var source = $("#entry-template").html();

    console.log("Handlebars template: ", source);

    var template = Handlebars.compile(source);

    var context = {title: "My New Post", body: "This is my first post!"};
    var html = template(context);

    console.log("Intro: ", $("#intro").size());

    $("#intro").append(html);

    console.log("did handlebars stuff", html);

});

