//TODO: Only use when working with single slide
//var installationData = "";
//installationData = JSON.parse(window.localStorage.getItem(constants.installationData));
//$('#backgroundImage').css({ 'background-image': "url(data:" + installationData.backgroundImage + ")" });
//window.localStorage.removeItem(constants.refChartTime);
//window.localStorage.removeItem(constants.refChartData);

$(function () {
    if (parent.forceFetch) {
        console.log('force fetching for chart1');
        fetchData();
    }
    else if (hasRecentData(constants.chart2CalcualtedData)) {
        console.log('getting calcualted data for chart2');
        isFetchingData = false;
        setChartWithLocalstoreData(constants.chart2CalcualtedData, prosessCalculatedData);
    }
    else if (hasRecentData(constants.chartRawdataData)) {
        console.log('getting raw data for chart2');
        isFetchingData = false;
        //Setting data based on local storage data. See chartLocalstore.js for more
        setChartWithLocalstoreData(constants.chartRawdataData, prosessRawData);
    }
    else {
        //Getting data. See chartLocalstore.js for more
        console.log('running fetchData() for chart2. No valid local data stored');
        fetchData(prosessRawData);
    }

    $("#chartContainer").addClass(parent.installationData.theme + 'Container');
    $("#main").addClass(parent.installationData.theme + 'Theme');
});


var dataMax = 0;
var dataTwoThirds = 0;
var dataOneThird = 0;

var maxAmountOfSensors = 9;
var calculatedRatio = 0.85;


var paddingLeft = 115;
var indexForMaxSensor = 0;

var chartModel = {
    data: [],
    groups: [],
    lastTempDate: null,
    actualMax: 0,
    actualMin: 0,
    temp : ['temp']
}

function prosessRawData(allRawData) {
    var rawData = allRawData.subs.days.subs;
    var count = 0;
    for (var key in rawData) {
        count++;
        if (count > maxAmountOfSensors) {
            break;
        }
        var newSensor = [key];
        chartModel.groups.push(key);
        for (var y = 0; y < rawData[key].data.length; y++) {
            newSensor.push(rawData[key].data[y].val);
        }
        chartModel.data.push(newSensor);
    }
    processRawTempData(allRawData);
}

function processRawTempData(allRawData) {
    var rawTempData = allRawData.subs.temperature.data;
    var chartLastUpdated = new Date(rawTempData[rawTempData.length - 1].description);
    chartModel.lastTempDate = ('0' + (chartLastUpdated.getDate() - 1)).slice(-2) + "." + ('0' + (chartLastUpdated.getMonth() + 1)).slice(-2) + " kl " + getTwoDigitClock(chartLastUpdated)
    for (var i = 0; i < rawTempData.length ; i++) {
        chartModel.temp.push(rawTempData[i].val);
    }
    chartModel.data.push(chartModel.temp);
    chartModel.actualMax = Math.max.apply(null, chartModel.temp.slice(1));
    chartModel.actualMin = Math.min.apply(null, chartModel.temp.slice(1));
    setLocalStoreData(constants.chart2CalcualtedData, chartModel);

    populateChart();
}


function prosessCalculatedData(data) {
    console.log('prosessCalculatedData() ', data);
    chartModel = data;
    populateChart();
}

function findDataAverageValues() {
    //TODO: Erstatte sensors med data fra server
    var maxValue = 0;
    var amountOfSensors = chartModel.data.length - 1; //Minus temp sensor?
    //i = 1 because first cell is text, not number
    for (var i = 1; i < chartModel.data[0].length; i++) {
        var amountToCheckAgainstMax = 0;
        for (var y = 0; y < amountOfSensors; y++) {
            amountToCheckAgainstMax += Math.round(chartModel.data[y][i]);
        }
        if (amountToCheckAgainstMax > maxValue) {
            maxValue = amountToCheckAgainstMax;
            indexForMaxSensor = i;
        }
    }
    dataMax = maxValue;
    dataTwoThirds = Math.round((dataMax * 2) / 3);
    dataOneThird = Math.round(dataMax / 3);
}

function calculateLeftPadding() {
    paddingLeft = (dataMax.toString().length * 28) + 50;
}

function populateChart() {
    findDataAverageValues();
    calculateLeftPadding();

    var chart = c3.generate({
        bindto: '#chart',
        padding: {
            left: paddingLeft,
            right: paddingLeft,
            bottom: -2
        },
        size: {
            height: 430
        },
        data: {
            columns: chartModel.data,
            type: 'bar',
            types: {
                temp: 'spline'
            },
            groups: [
                chartModel.groups
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
                max: chartModel.actualMax + (chartModel.actualMax - chartModel.actualMin) * 0.5,
                min: chartModel.actualMin - (chartModel.actualMax - chartModel.actualMin) * 0.5,
                tick: {
                    format: function (x) { return x + "C°"; },
                    count: 3,
                    values: [chartModel.actualMin, chartModel.actualMax]
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
                ratio: calculatedRatio,
            }
        },
        point: {
            show: false
        },
        tooltip: {
            show: false
        }
    });


    markHighestBar();
    makePathGoAllTheWayAndGetLastXY();

    ko.applyBindings({
        groups: chartModel.groups,
        getClass: function (index) {
            return 'sensorLabel' + (this.groups.indexOf(index) + 1);
        },
        dataMax: dataMax + 'kW',
        lastNight: chartModel.lastTempDate
    });

    adjustXTicks();
    expandWhiteBand();
}


function expandWhiteBand() {
    var chartContainer = $("#chartContainer");
    var chart2MarginFix = 28;
    var magicNumber = 3;
    $("#whiteBand").css({ "top": chartContainer.offset().top + (chartContainer.height()) - (chart2MarginFix - magicNumber) + "px" });
    $("#chart").addClass('chart2MarginFix');
}

function adjustXTicks() {
    //minus 2 pga length vs index samt label
    var maxLength = (chartModel.data[0].length - 2);

    $(".c3-axis.c3-axis-x line").each(function ($i) {
        if (($i + 1) % 24 == 0) {
            $(this).attr('y2', 12);
        }
        else {
            $(this).hide();
        }
    });

    var lastNight = $("#lastNight");
    lastNight.css({ 'margin-right': (lastNight.width() / 2) + 10 + 'px' });
}


//Markerer bar som har høyeste verdi
function markHighestBar() {
    $('.c3-bar-' + (indexForMaxSensor - 1)).addClass("markedBar");
}

//Gjøre line graf litt lenger på slutten
function makePathGoAllTheWayAndGetLastXY() {
    var path = $(".c3-line-temp").first();
    var pathData = path.attr('d').split(',');
    pathData[pathData.length - 2] = (parseFloat(pathData[pathData.length - 2]) + 20).toString();
    path.attr('d', pathData);
}

