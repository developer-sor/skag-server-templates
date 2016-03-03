/**
 * Created by narve on 2016-02-18.
 */

"use strict";
var installationData = "";

console.log("Loading index");

var templateController = {
// TODO: Fetch from server, cache in local storage
//    templatesInUse: ["intro", "dev", "yr"],
    templatesInUse: null,
    templates: [],
    templateIndex: 0,
    defaultTimeOut: 5000,
    addTemplate: function( templ ) {
        this.templates.push( templ );
    },
    setInstallationData: function (data) {
        console.log("setInstallationData running", data);
        var self = this;
        this.templatesInUse = data.templatesInUse;
        installationData = data;

        convertToDataURLviaCanvas(data.backgroundImageURL, function (base64Img) {
            data.backgroundImage = base64Img;
            window.localStorage.setItem(constants.installationTime, new Date());
            window.localStorage.setItem(constants.installationData, JSON.stringify(data));
            self.runTemplates();
            $('body').css({ 'background-image': "url(data:" + parent.installationData.backgroundImage + ")" });
        });
    },
    fetchDataFromServer: function () {
        var self = this;
        var url = constants.api + constants.installation.replace("{id}", installation.id);
        $.ajax({
            method: "GET",
            contentType: "application/json",
            url: url,
            dataType: 'json'
        })
        .done(function (data) {
            console.log('Fetched data: ',data);
            data.templatesInUse = ["slide1", "yr", "chart2", "chart1"];
            self.setInstallationData(data);

        })
        .fail(function (error) {
            console.log('Error fetching data from server: ', error);
            if (self.hasValidInstallationData()) {
                console.log('Backup solution: getting installationdata from localstorage since fetch failed');
                self.setInstallationBasedOnInstallationData();
            }
        });
    },
    hasRecentInstallationData: function(){
        var date = window.localStorage.getItem(constants.installationTime);
        var d1 = new Date();
        var d2 = new Date(d1);
        d2.setHours(d1.getHours() + 1);

        return date !== null && date !== undefined && Date.parse(date) < d2.getTime();
    },
    hasValidInstallationData: function () {
        var tempData = window.localStorage.getItem(constants.installationData);
        if (isNullOrEmpty(tempData)) {
            return false;
        }
        tempData = JSON.parse(tempData);
        console.log(tempData);
        //Checking if required strings is okay
        return !isNullOrEmpty(tempData.backgroundImageURL) && !isNullOrEmpty(tempData.description) && !isNullOrEmpty(tempData.backgroundImageURL) && !isNullOrEmpty(tempData.location);
    },
    setInstallationBasedOnInstallationData: function(){
        var data = JSON.parse(window.localStorage.getItem(constants.installationData));
        this.templatesInUse = data.templatesInUse;
        installationData = data;
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
        if (this.hasRecentInstallationData() && this.hasValidInstallationData()) {
            console.log("Found valid installationdata");
            this.setInstallationBasedOnInstallationData();
            this.runTemplates();
        }
        else {
            console.log("Installationdata not retrieved yet or to old. Attempting to fetch from server..");
            this.fetchDataFromServer();
        }
    },
    runTemplates: function () {
        console.log('runTemplates : ', this.templatesInUse);
        if (this.templatesInUse != null) {
            var s = this.templates
            .map(function (t) {
                return "<span id=" + t.id + ">" + t.name + "</span>";
            })
            .join("");
            $("#template-list").html(s);
            $("#master-header").html(installation.name);

            this.showSlide(this.findTemplate(this.templatesInUse[0]));
        }
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

