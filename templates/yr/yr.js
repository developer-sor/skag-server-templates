


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

    if (hasRecentData(constants.yrData) && !parent.forceFetch) {
        setWeatherForecast(getLocalstoreData(constants.yrData));
        return;
    }

    var url = parent.installationData.location;
    /*console.log('yr.no url -> ', url);*/

    $.ajax({
        method: "GET",
        url: url,
        cache: true,
        dataType: 'xml'
    })
    .done(function (data) {
        if (data) {
            /*console.log("Got vær-data from yr");*/
            var jsonData = xmlToJson(data);
            setLocalStoreData(constants.yrData, jsonData);

            setWeatherForecast(jsonData);
        }
        else{
            handleError();
        }
    })
    .fail(function (error) {
        console.error('Error fetching data from yr: ', error);
        handleError();
    });

};

function handleError() {
    if (hasNonExpiredData(constants.yrData)) {
        /*console.log('Backup solution: getting yrdata from localstorage since fetch failed');*/
        self.setWeatherForecast(getLocalstoreData(constants.yrData));
    }
    else {
        /*console.log('Backup solution failed for the Yr template! No data in localstorage and fetch failed, running next slide');*/
        parent.templateController.abortSlide(template.name);
    }
}


createWeatherForecast();



function setWeatherForecast(jsonData) {
    $("#yr-credits").html(jsonData.weatherdata.credit.link["@attributes"].text);
    var weatherHTML = '';
    var firstIndex = 0;
    var now = new Date();

    //I tilfelle vi bruker gamle data fra localstorage, sørg for at vi begynner på et tidspunkt som er relevant
    for (var i = 0; i < jsonData.weatherdata.forecast.tabular.time.length; i++) {
        if (now < new Date(jsonData.weatherdata.forecast.tabular.time[i]["@attributes"].to).getTime()) {
            firstIndex = i;
            break;
        }
    }

    for (var i = firstIndex; i < (firstIndex+4) ; i++) {
        var data = jsonData.weatherdata.forecast.tabular.time[i];

        var from = new Date(data["@attributes"].from).getHours();
        var to = new Date(data["@attributes"].to).getHours();
        var period = data["@attributes"].period;
        var temp = data.temperature["@attributes"].value;
        var symbol = data.symbol["@attributes"];

        var dayText = '';
        if (i == firstIndex) {
            dayText = 'I dag';
        }
        else if (period === "0") {
            dayText = 'I morgen';
        }

        var symbolHTML = '<div class="symbol"><img src="b350/' + symbol.var + '.png" alt="weatherSymbol"></div>';
        var tempHTML = '<h1 class="temp">' + temp + '<span class="Cchar">&deg</span><span class="Cchar">C</span></h1>'
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