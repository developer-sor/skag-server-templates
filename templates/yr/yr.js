


$(function () {
    $("#main").addClass(parent.installationData.theme + 'Theme');
});

getTwoDigitDate = function () {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    return ('0' + hours).slice(-2) + ":" + ('0' + minutes).slice(-2)
}

function createWeatherForecast() {
    var self = this;

    if (hasValidStoredData()) {
        setWeatherForecast();
        return;
    }

    var url = parent.installationData.location;
    console.log('yr.no url -> ', url);

    $.ajax({
        method: "GET",
        url: url,
        cache: true,
        dataType: 'xml'
    })
    .done(function (data) {
        if (data) {
            console.log("Got vær-data from yr");
            var jsonData = xmlToJson(data);
            setWeatherForecast(jsonData);

            window.localStorage.setItem(constants.yrTime, new Date());
            window.localStorage.setItem(constants.yrData, JSON.stringify(jsonData));
        }
        else if (!data && self.hasValidStoredData()) {
            console.log('Backup solution: getting yrdata from localstorage since data is undefined');
            self.setWeatherForecast(prosessRawData);
        }
        else {
            console.log('Failed to retrieve data from yr. Got no backup data either, aborting slide..');
            parent.templateController.abortSlide(template.name);
        }
    })
    .fail(function (error) {
        console.log('Error fetching data from yr: ', error);
        if (self.hasValidStoredData()) {
            console.log('Backup solution: getting yrdata from localstorage since fetch failed');
            self.setWeatherForecast(prosessRawData);
        }
        else {
            console.log('Failed to retrieve data from yr. Got no backup data either, aborting slide..');
            parent.templateController.abortSlide(template.name);
        }
    });

};

createWeatherForecast();

function hasValidStoredData() {
    var date = window.localStorage.getItem(constants.yrTime);
    var d1 = new Date();
    var d2 = new Date(d1);
    d2.setHours(d1.getHours() - constants.yrRefreshHours);

    return date !== null && date !== undefined && Date.parse(date) > d2.getTime();
}

function setWeatherForecast(jsonData) {
    this.jsonData = jsonData;
    if (jsonData === undefined || jsonData === null) {
        this.jsonData = JSON.parse(window.localStorage.getItem(constants.yrData));
        console.log("got data from local storage ");
    }

    $("#yr-credits").html(this.jsonData.weatherdata.credit.link["@attributes"].text);
    var weatherHTML = '';
    for (var i = 0; i < 4; i++) {
        var data = this.jsonData.weatherdata.forecast.tabular.time[i];

        var from = new Date(data["@attributes"].from).getHours();
        var to = new Date(data["@attributes"].to).getHours();
        var period = data["@attributes"].period;
        var temp = data.temperature["@attributes"].value;
        var symbol = data.symbol["@attributes"];

        var dayText = '';
        if (i == 0) {
            dayText = 'I dag';
        }
        else if (period === "0") {
            dayText = 'I morgen';
        }

        var symbolHTML = '<div class="symbol"><img src="b200/' + symbol.var + '.png" alt="weatherSymbol"></div>';
        var tempHTML = '<h1 class="temp">' + temp + '&#8451;</h1>';
        var timeHTML = '<h2 class="time">kl ' + ('0' + from).slice(-2) + '-' + ('0' + to).slice(-2) + '</h3>';
        weatherHTML += '<div class="weatherWrapper floatLeft"><h2 class="dayText">' + dayText + '</h2><div class="weather lightContainer"><div>' + symbolHTML + tempHTML + timeHTML + '</div></div></div>'
    }
    $("#weatherForecast").html(weatherHTML);
}


// https://davidwalsh.name/convert-xml-json
// Changes XML to JSON
function xmlToJson(xml) {

    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
};