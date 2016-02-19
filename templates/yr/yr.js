/**
 * Created by narve on 2016-02-19.
 */

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

        var yrStuff = jsonData.weatherdata.forecast.tabular.time
            .map( function(t) {
                var s = "Time: " + t["@attributes"].from;
                s += ", pressure: " + t.pressure["@attributes"].value + " " + t.pressure["@attributes"].unit;
                return s;
            }).map( function(s) { return "<p>" + s + "</p>"})
            .join("");

        $("#yr").html(yrStuff);

    });


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
            if (typeof(obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof(obj[nodeName].push) == "undefined") {
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