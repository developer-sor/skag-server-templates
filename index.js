/**
 * Created by narve on 2016-02-18.
 */
//Mock data
//data.templatesInUse = [
//    {
//        name: "chart2",
//        timeoutMillis: 500000
//    },
//    {
//        name: "chart1",
//        timeoutMillis: 500000
//    },
//    {
//        name: "yr",
//        timeoutMillis: 500000
//    },
//    {
//        name: "intro",
//        timeoutMillis: 500000
//    }];


"use strict";
var installationData = "";

console.log("Loading index");

var templateController = {
    templatesInUse: null,
    templates: [],
    templatesToForceFetchOn: [],
    templateIndex: 0,
    template: null,
    defaultTimeOut: 5000,
    failText : 'Backup solution failed! No installationdata from server or in local storage. Connect to internet and refresh page',
    addTemplates: function (templates) {
        if (!templates || templates.length == 0) {
            console.log('addTemplates() -> missing templates');
            return;
        }
        this.templates = this.templates.concat(templates);
    },
    setInstallationData: function (data) {
        var self = this
        this.templatesInUse = data.templatesInUse;
        this.templatesToForceFetchOn = forceFetch ? data.templatesInUse.slice() : this.templatesToForceFetchOn;
        installationData = data;

        convertToDataURLviaCanvas(data.backgroundImageURL, function (base64Img) {
            data.backgroundImage = base64Img;
            window.localStorage.setItem(constants.installationTime, new Date());
            window.localStorage.setItem(constants.installationData, JSON.stringify(data));
            self.runTemplates();
            self.setBackgroundImage();
        });
    },
    setBackgroundImage: function () {
        $('#backgroundImage').css({ 'background-image': "url(data:" + installationData.backgroundImage + ")" });
        $('#backgroundOverlay').addClass(installationData.theme+'BackgroundOverlay')
    },
    fetchDataFromServer: function () {
        var self = this;

        var url = constants.api + constants.installation.replace("{key}", installation.key);
        console.log("get() installation -> url ", url);
        $.ajax({
            method: "GET",
            contentType: "application/json",
            url: url,
            dataType: 'json'
        })
        .done(function (data) {
            if (data) {
                data.templatesInUse = [
                    {
                        name: "yr",
                        timeoutMillis: 500000
                    },
                    {
                        name: "chart1",
                        timeoutMillis: 5000
                    },
                    {
                        name: "intro",
                        timeoutMillis: 5000
                    },
                    {
                        name: "chart2",
                        timeoutMillis: 5000
                    }];
                self.setInstallationData(data);
            }
            else if (!data && self.hasValidInstallationData()) {
                console.log('Backup solution: getting installationdata from localstorage since fetch failed');
                self.setInstallationBasedOnInstallationData();
            }
            else {
                console.log(self.failText);
                $("#message").show().text(self.failText);
            }

        })
        .fail(function (error) {
            console.log('Error fetching data from server: ', error);
            if (hasRecentData(constants.installationData)) {
                console.log('Backup solution: getting installationdata from localstorage since fetch failed');
                self.setInstallationBasedOnInstallationData();
            }
            else {
                console.log(self.failText);
                $("#message").show().text(self.failText);
            }
        });
    },
    hasValidInstallationData: function () {
        var tempData = getLocalstoreData(constants.installationData);
        if (!tempData) {
            return false;
        }
        return !isNullOrEmpty(tempData.description) && !isNullOrEmpty(tempData.backgroundImageURL) && !isNullOrEmpty(tempData.location);
    },
    setInstallationBasedOnInstallationData: function () {
        var data = getLocalstoreData(constants.installationData);
        if (!data) {
            console.log('setInstallationBasedOnInstallationData() -> local data was non-existing');
            return false;
        }
        this.templatesInUse = data.templatesInUse;
        installationData = data;
        this.setBackgroundImage();
    },
    nextSlide: function (current) {
        var self = this;
        if (current != this.templatesInUse[this.templateIndex].name) {
            console.log('nextSlide() -> redudandant call. Returning')
            return;
        }

        self.templateIndex++;
        if (self.templateIndex >= self.templatesInUse.length) {
            self.templateIndex = 0;
        }

        console.log("Should show next slide...", self.templateIndex);
        var template = this.templatesInUse[self.templateIndex];

        if (forceFetch) {
            console.log('Forcing fetch for', template.name);
            self.applyForceFetch(template);
        }
        
        self.showSlide(template);
    },
    applyForceFetch: function (template) {
        this.templatesToForceFetchOn.splice(this.templatesToForceFetchOn.indexOf(template), 1);
        forceFetch = this.templatesToForceFetchOn.length > 0 ? forceFetch : false;
        console.log('continue force fetching ? ', forceFetch.toString());
    },
    start: function () {
        if (hasRecentData(constants.installationData) && this.hasValidInstallationData() && !forceFetch) {
            console.log("Found valid installationdata");
            this.setInstallationBasedOnInstallationData();
            this.runTemplates();
        }
        else {
            console.log("Installationdata not retrieved yet or to old or fetch is forced. Attempting to fetch from server..");
            this.fetchDataFromServer();
        }
    },
    runTemplates: function () {
        if (this.templatesInUse != null) {
            this.addTemplates(this.templatesInUse);
            $("#master-header").html(installation.name);
            this.showSlide();
        }
    },
    abortSlide: function (name) {
        console.log('aborting slide...');
        clearTimeout(this.currentNextSlidePromise);
        this.nextSlide(name);
    },
    showSlide: function () {
        var self = this;
        var currentTemplate = this.templates[this.templateIndex];
        $("#content").attr("src", "templates/" + currentTemplate.name + "/index.html").load(function () {
            console.log(self.template);
            if (self.template.canShow()) {
                var timeoutMillis = currentTemplate.timeoutMillis || self.defaultTimeOut;

                clearTimeout(self.currentNextSlidePromise);
                self.currentNextSlidePromise = setTimeout(function () {
                    self.nextSlide(currentTemplate.name);
                }, timeoutMillis);
            }
            else {
                console.log('cant show template, skipping');
                self.nextSlide(currentTemplate.name);
            }
        });
    }
}

