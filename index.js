/**
 * Created by narve on 2016-02-18.
 */

"use strict";


console.log("Loading index");

var templateController = {
// TODO: Fetch from server, cache in local storage
//    templatesInUse: ["intro", "dev", "yr"],
    templatesInUse: installation.templatesInUse,

    templates: [],
    templateIndex: 0,
    defaultTimeOut: 5000,
    addTemplate: function( templ ) {
        this.templates.push( templ );
    },
    findTemplate: function( templateIdString ) {
        var template = null;
        for( var i = 0; i < this.templates.length; i++ ) {
            if( this.templates[i].id == templateIdString )
                template = this.templates[i];
        }
        //console.log( "Findtemplate ", templateIdString, " => ", template, " from ", this.templatesInUse );
        return template;
    },
    nextSlide: function (current) {
        var self = this;
        if (current != self.templateIndex) {
            console.log("Next slide ", current, self.templateIndex, " was redundant, ignoring");
            return;
        }

        var template = this.findTemplate( this.templatesInUse[self.templateIndex]);
        $("#" + template.id).attr( "style", "border: 0");

        console.log("Should show next slide...", self.templateIndex);
        self.templateIndex++;
        if (self.templateIndex >= self.templatesInUse.length)
            self.templateIndex = 0;

        template = this.findTemplate( this.templatesInUse[self.templateIndex]);

        console.log("Should show next slide...", self.templateIndex);
        self.showSlide(template);
    },
    start: function () {
        var s = this.templates
            .map(function (t) {
                return "<span id=" + t.id + ">" + t.name + "</span>";
            })
            .join("");
        $("#template-list").html(s);
        $("#master-header").html(installation.name);

        this.showSlide(this.findTemplate( this.templatesInUse[0]));
    },

    showSlide: function (template) {
        var self = this;
        if (!template.canShow || template.canShow()) {
            console.log("Launching template: ", template.name);
            $("#content").attr("src", "templates/" + template.id + "/index.html");
            $("#" + template.id).attr( "style", "border-bottom: 2px solid black");
            $("#timeout").html( template.defaultTimeOut || this.defaultTimeOut)
            //template.doShow(this.nextSlide);
        }

        var timeoutMillis = template.defaultTimeOut || this.defaultTimeOut;
        clearTimeout(this.currentNextSlidePromise);
        this.currentNextSlidePromise = setTimeout(function () {
            self.nextSlide(self.templateIndex);
        }, timeoutMillis);
    }
}
