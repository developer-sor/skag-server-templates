/**
 * Created by narve on 2016-02-19.
 */

getTwoDigitDate = function () {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    return ('0' + hours).slice(-2) + ":" + ('0' + minutes).slice(-2)
}

function createWeatherForecast() {
    var url = "http://www.yr.no/sted/Norge/Vest-Agder/Songdalen/Songdalen/varsel.xml";

    var settings = {
        type: "GET",
        cache: true,
        dataType: "xml"
    };
    jQuery.ajax(url, settings)
        .done(function (data, textStatus, jqXHR) {
            console.log("Got vær-data from yr");
            var jsonData = xmlToJson(data);
            console.log("Got vær-data from yr", jsonData);
            $("#yr-credits").html(jsonData.weatherdata.credit.link["@attributes"].text);


            var weatherHTML = '';
            for (var i = 0; i < 4; i++) {
                var data = jsonData.weatherdata.forecast.tabular.time[i];

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

                var symbolHTML = '<div class="symbol">' + symbol.name + '</div>';
                var tempHTML = '<h1 class="temp">' + temp + '&#8451;</h1>';
                var timeHTML = '<h3 class="time">kl ' + ('0' + from).slice(-2) + '-' + ('0' + to).slice(-2) + '</h3>';

                weatherHTML += '<div class="weatherWrapper floatLeft"><h2 class="dayText">' + dayText + '</h2><div class="weather lightContainer">' + symbolHTML + tempHTML + timeHTML + '</div></div>'
            }
            console.log(weatherHTML);
            $("#weatherForecast").html(weatherHTML);
        });
};

createWeatherForecast();

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