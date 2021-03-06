

"use strict";
var installationData = "";

console.log("Loading index");

var templateController = {
    templatesInUse: null,
    templatesToForceFetchOn: [],
    templateIndex: 0,
    defaultInfoslideTimeoutMs: 10000,
    currentActiveIframe: constants.content1,
    defaultTimeOut: 5000,
    currentTimeoutPromise: null,
    started: false,
    failText: 'Backup solution failed! No installationdata from server or in local storage. Connect the device to the internet',
    setInstallationData: function (data) {
        var self = this;
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
        $('#backgroundImage').css({'background-image': "url(data:" + installationData.backgroundImage + ")"});
        $('#backgroundOverlay').addClass(installationData.theme + 'BackgroundOverlay')
    },
    fetchClientInfoslides: function (installationData) {
        var self = this;

        var url = constants.api + constants.informasjonssider.replace("{clientKey}", installation.clientKey);
        $.ajax({
            method: "GET",
            contentType: "application/json",
            url: url,
            dataType: 'json'
        }).done(function (data) {
            if (data && data.length > 0) {
                console.log('Fetched informationpages successfully from server ');
                for(var i = 0; i < data.length; i ++) {
                    installationData.templatesInUse.push({
                        name: "informasjon",
                        timeoutMillis: self.defaultInfoslideTimeoutMs,
                        informasjonId: data[i].id
                    });
                }
            }
        }).fail(function (error) {
            console.error('Failed to fetch client infoslides from server: ', error);
        }).always(function(){
            self.setInstallationData(installationData);
        });
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
        }).done(function (data) {
            if (data) {
                //Hide error message if this is showing
                $("#message").hide();

                /*data.templatesInUse = [
                    {
                        name: "chart2",
                        timeoutMillis: 10000000
                    },
                    {
                        name: "intro",
                        timeoutMillis: 10000
                    },
                    {
                        name: "yr",
                        timeoutMillis: 10000
                    },
                    {
                        name: "chart1",
                        timeoutMillis: 10000
                    }
                ];*/
                self.fetchClientInfoslides(data);
            }
            else if (!data && self.hasValidInstallationData()) {
                console.error('Backup solution: getting installationdata from localstorage since fetch failed');
                self.setInstallationBasedOnInstallationData();
            }
            else {
                console.error(self.failText);
                $("#message").show().text(self.failText);
                //Retry fetch until we get data
                self.start();
            }

        }).fail(function (error) {
            console.error('Error fetching data from server: ', error);
            if (self.hasValidInstallationData()) {
                console.error('Backup solution: getting installationdata from localstorage since fetch failed');
                self.setInstallationBasedOnInstallationData();
            }
            else {
                console.error(self.failText);
                $("#message").show().text(self.failText);
                //Retry fetch until network is back
                self.start();
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
        this.runTemplates();
    },
    applyForceFetch: function (template) {
        this.templatesToForceFetchOn.splice(this.templatesToForceFetchOn.indexOf(template), 1);
        forceFetch = this.templatesToForceFetchOn.length > 0 ? forceFetch : false;
        console.log('continue force fetching ? ', forceFetch.toString());
    },
    checkForValidDataOrFetch: function () {
        if (hasRecentData(constants.installationData) && this.hasValidInstallationData()) {
            console.log("Found valid installationdata");
            this.setInstallationBasedOnInstallationData();
        }
        else {
            console.log("Installationdata not retrieved yet or to old or fetch is forced. Attempting to fetch from server..");
            this.fetchDataFromServer();
        }
    },
    start: function () {
        if (forceFetch) {
            this.fetchDataFromServer();
        }
        else {
            this.checkForValidDataOrFetch();
        }
    },
    runTemplates: function () {
        if (this.templatesInUse !== null && !this.started) {
            this.started = true;
            $("#master-header").html(installation.name);
            this.showNextSlide('start');
        }
    },
    getNextSlideIndex: function () {
        var self = this;
        var nextIndex = self.templateIndex + 1;
        if (nextIndex >= self.templatesInUse.length) {
            return 0;
        }
        return nextIndex;
    },
    setNextSlideIndex: function () {
        var self = this;
        self.templateIndex = self.getNextSlideIndex();
    },
    nextSlide: function () {
        var self = this;
        self.checkForValidDataOrFetch();
        self.setNextSlideIndex();
        var template = this.templatesInUse[self.templateIndex];
        console.log("Should show next slide...", self.templateIndex);

        if (forceFetch) {
            console.log('Forcing fetch for', template.name);
            self.applyForceFetch(template);
        }

        self.showNextSlide();
    },
    lazyLoadNextSlide: function (aborted) {
        var self = this;
        var currentTemplate = this.templatesInUse[self.getNextSlideIndex()];

        if (!aborted) {
            this.currentActiveIframe = this.currentActiveIframe === constants.content1 ? constants.content2 : constants.content1;
        }

        var src = "templates/" + currentTemplate.name + "/index.html" + (currentTemplate.informasjonId ? '?informasjonId='+currentTemplate.informasjonId : '');
        var newIframe = '<iframe src="' + src + '"></iframe>';

        $(this.currentActiveIframe).empty().append(newIframe);

        console.log('lazy loading ', currentTemplate.name, ' in ', this.currentActiveIframe);
    },
    showNextSlide: function (start) {
        console.log('showNextSlide() ');
        var self = this;
        var currentTemplate = this.templatesInUse[this.templateIndex];
        var timeoutMillis = currentTemplate.timeoutMillis || self.defaultTimeOut;

        if (start) {
            var src = "templates/" + currentTemplate.name + "/index.html" + (currentTemplate.informasjonId ? '?informasjonId='+currentTemplate.informasjonId : '');
            var newIframe = '<iframe src="' + src + '"></iframe>';

            $(this.currentActiveIframe).empty().append(newIframe);
        }
        else {
            self.toggleNextIFrame();
        }

        clearTimeout(self.currentTimeoutPromise);
        self.currentTimeoutPromise = setTimeout(function () {
            console.log('time for next slide');
            self.nextSlide();
        }, timeoutMillis);

        self.lazyLoadNextSlide();

    },
    toggleNextIFrame: function () {
        $(constants.content1).toggleClass('transparent');
        $(constants.content2).toggleClass('transparent');
    },
    abortSlide: function (name, id) {
        var self = this;
        console.log('aborting slide ' + name + '. Lazy loading next slide');

        if(id && this.templatesInUse[this.templateIndex].name === name
            && this.templatesInUse[this.templateIndex].id === id){
            console.log('aborted slide is the active one -> running showNextSlide()');
            self.showNextSlide();
        }
        else if (!id && this.templatesInUse[this.templateIndex].name === name) {
            console.log('aborted slide is the active one -> running showNextSlide()');
            self.showNextSlide();
        }
        else {
            console.log('aborted slide is lazy loading. Attempting to lazy load another one');
            self.setNextSlideIndex();
            this.lazyLoadNextSlide(true);
        }
    }
};

