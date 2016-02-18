/**
 * Created by narve on 2016-02-18.
 */

"use strict";


console.log("Loading index");

var templates = {};



var templateController = {
// TODO: Fetch from server, cache in local storage
    templatesInUse: ["intro", "dev"],
    templateIndex: 0,
    nextSlide: function () {
        var self = this;
        self.templateIndex++;
        if( self.templateIndex >= self.templatesInUse.length )
            self.templateIndex = 0;
        console.log("Should show next slide...", self.templateIndex);
        self.showSlide( self.templateIndex);
    },
    start: function () {
        console.log("Starting controller");
        this.showSlide(0);
    },
    showSlide: function (templateIndex) {
        var self = this;
        self.templateIndex = templateIndex;
        var templateId = self.templatesInUse[templateIndex];
        var template = templates[templateId];

        if (template.canShow && template.canShow()) {
            console.log("Launching template: ", template);
            $("#content").attr("src", "templates/" + template.id + "/index.html");
            //template.doShow(this.nextSlide);
        }

        var timeoutMillis = template.defaultTimeOut || 5000;
        setTimeout( function() {
            self.nextSlide();
        }, timeoutMillis );
    }
}
