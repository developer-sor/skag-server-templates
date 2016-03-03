//TODO: Only use when working with single slide
var installationData = "";
installationData = JSON.parse(window.localStorage.getItem(constants.installationData));
$('body').css({ 'background-image': "url(data:" + installationData.backgroundImage + ")" });
//window.localStorage.removeItem(constants.refChartTime);
//window.localStorage.removeItem(constants.refChartData);

$(function () {

    if (hasRecentChartData() && hasValidChartData()) {
        //Setting data based on local storage data. See chartLocalstore.js for more
        setChartWithLocalstoreData(prosessRawData);
    }
    else {
        //Getting data. See chartLocalstore.js for more
        fetchData();
    }
});


var temp = ['temp', 1, 2, 3, 2, -3, 3, -2, 1, 1, 1, 0, 1, 1, 2, 3, 2, -3, 3, -2, 1, 1];

var actualMax = Math.max.apply(null, temp.slice(1));
var actualMin = Math.min.apply(null, temp.slice(1));

var dataMax = 0;
var dataTwoThirds = 0;
var dataOneThird = 0;

var data = [];
var groups = [];
//var data = [sensor1, sensor2, temp];

var paddingLeft = 115;
var indexForMaxSensor = 0;

function prosessRawData(allRawData) {
    var rawData = allRawData.subs.days.subs;
    console.log("prosessRawData() -> Initiated on chart2 ", rawData);


    var count = 0;
    for (var key in rawData) {
        count++;
        if (count > 6) {
            break;
        }
        var newSensor = [key];
        groups.push(key);
        for (var y = 0; y < rawData[key].data.length; y++) {
            newSensor.push(rawData[key].data[y].val);
        }
        data.push(newSensor);
    }

    data.push(temp);
    populateChart();
}


function findDataAverageValues() {
    //TODO: Erstatte sensors med data fra server
    var maxValue = 0;
    var amountOfSensors = data.length - 1; //Minus temp sensor?

    //i = 1 because first cell is text, not number
    for (var i = 1; i < data[0].length; i++) {
        var amountToCheckAgainstMax = 0;
        for (var y = 0; y < amountOfSensors; y++) {
            amountToCheckAgainstMax += parseInt(data[y][i]);
        }
        if (amountToCheckAgainstMax > maxValue) {
            maxValue = amountToCheckAgainstMax;
            indexForMaxSensor = i;
        }
    }
    dataMax = maxValue;
    dataTwoThirds = parseInt(maxValue * 0.66);
    dataOneThird = parseInt(maxValue * 0.33);
}


function populateChart() {
    findDataAverageValues();

    var chart = c3.generate({
        padding: {
            top: 10,
            left: paddingLeft,
            bottom: -2
        },
        data: {
            columns: data,
            type: 'bar',
            types: {
                temp: 'spline'
            },
            groups: [
                groups
            ],
            axes: {
                temp: 'y2'
            }
        },
        legend: {
            show: false
        },
        axis: {
            y: {
                padding: {
                    top: 100
                },
                tick: {
                    format: function (x) { return " " + x + "kW -"; },
                    count: 3,
                    values: [dataOneThird, dataTwoThirds, dataMax]
                }
            },
            y2: {
                show: true,
                max: actualMax + (actualMax - actualMin) * 0.5,
                min: actualMin - (actualMax - actualMin) * 0.5,
                tick: {
                    format: function (x) { return x + "C°"; },
                    count: 3,
                    values: [actualMin, actualMax]
                }
            },
            x: {
                show: true,
                tick: {
                    format: function (x) { if (x == 0 || x == 24) { return "" }; }
                }
            },
            x2: {
                show: true
            }
        },
        bar: {
            width: {
                ratio: 0.9
            }
        },
        point: {
            show: false
        }
    });

    expandWhiteBand();
    markHighestBar();
    makePathGoAllTheWayAndGetLastXY();
    adjustXTicks();

    ko.applyBindings({
        groups: groups
    });
}


function expandWhiteBand() {
    var chartContainer = $("#chartContainer");
    $("#whiteBand").css({ "top": chartContainer.offset().top + chartContainer.height() + "px" });
}

function adjustXTicks() {
    $(".c3-axis-x line").each(function () {
        $(this).attr('y2', 12);
    });
}

//Markerer bar som har høyeste verdi
function markHighestBar() {
    $('.c3-bar-' + (indexForMaxSensor-1)).addClass("markedBar");
}

//Gjøre line graf litt lenger på slutten
function makePathGoAllTheWayAndGetLastXY() {
    var path = $(".c3-line-temp").first();
    var data = path.attr('d').split(',');
    data[data.length - 2] = (parseFloat(data[data.length - 2]) + 20).toString();
    path.attr('d', data);
}

