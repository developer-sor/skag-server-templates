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


var temp = [];

var actualMax = 0;
var actualMin = 0;

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

    processRawTempData(allRawData);
}

function processRawTempData(allRawData) {
    var rawTempData = allRawData.subs.temperature.data;
    console.log("processRawTempData() -> Initiated on chart2 ", rawTempData);

    //Henter kun ut temperatur for det vi har strømdata for
    var measurements = data[0].length - 1;
    var tempLength = rawTempData.length - 1;
    for (var i = tempLength; i > (tempLength - measurements) ; i--) {
        temp.push(rawTempData[i].val);
    }

    temp.push('temp');
    temp.reverse();
    data.push(temp);
    actualMax = Math.max.apply(null, temp.slice(1));
    actualMin = Math.min.apply(null, temp.slice(1));

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

function calculateLeftPadding() {
    paddingLeft = (dataMax.toString().length * 28) + 50;
}


function populateChart() {
    findDataAverageValues();
    calculateLeftPadding();

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
    
    var refChartTime = window.localStorage.getItem(constants.refChartTime);
    var chartLastUpdated = new Date(refChartTime);
    var date = new Date();
    ko.applyBindings({
        groups: groups,
        getClass: function (index) {
            return 'sensorLabel' + (this.groups.indexOf(index) + 1);
        },
        dataMax: dataMax + 'kW',
        lastNight: ('0' + (chartLastUpdated.getDate() - 1)).slice(-2) + "." + ('0' + (chartLastUpdated.getMonth() + 1)).slice(-2) + " kl 24:00",
        showLastNight: data[0].length > 24
    });

    adjustXTicks();
}


function expandWhiteBand() {
    var chartContainer = $("#chartContainer");
    $("#whiteBand").css({ "top": chartContainer.offset().top + chartContainer.height() + "px" });
}

function adjustXTicks() {
    //minus 2 pga length vs index samt label
    var maxLength = (data[0].length - 2);
    
    $(".c3-axis.c3-axis-x line").each(function ($i) {
        if (($i + 1) % 24 == 0) {
            $(this).attr('y2', 12);

            if ($i + 24 > data[0].length) {
                alignLastNightDateText($(this).offset().left);
            }
        }
        else if ($i == maxLength) {
            var colWidth = ($(".c3-event-rect-0").attr("width")/2)-3;
            $(this).attr({ 'y2': 36, 'x1': colWidth, 'x2': colWidth });
        }
        else {
            $(this).hide();
        }
    });
}

//Aligner lastNight datoen til å være midtstilg på den den siste streken
function alignLastNightDateText(elementLeftOffset) {
    var lastNightElement = $("#lastNight");
    var left = elementLeftOffset - (lastNightElement.width() / 2);
    $("#lastNight").css({ 'position': 'absolute', 'left': left + 'px' });
}

//Markerer bar som har høyeste verdi
function markHighestBar() {
    $('.c3-bar-' + (indexForMaxSensor - 1)).addClass("markedBar");
}

//Gjøre line graf litt lenger på slutten
function makePathGoAllTheWayAndGetLastXY() {
    var path = $(".c3-line-temp").first();
    var data = path.attr('d').split(',');
    data[data.length - 2] = (parseFloat(data[data.length - 2]) + 20).toString();
    path.attr('d', data);
}

