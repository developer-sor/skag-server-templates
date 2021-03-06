﻿

$(function () {
    if (parent.forceFetch) {
        fetchData(null, constants.chart2CalcualtedData);
    }
    else if (hasRecentData(constants.chart2CalcualtedData) && hasRecentData(constants.chartRawdataData)) {
        isFetchingData = false;
        setChartWithLocalstoreData(constants.chart2CalcualtedData, prosessCalculatedData);
    }
    else if (hasRecentData(constants.chartRawdataData)) {
        isFetchingData = false;
        //Setting data based on local storage data. See chartLocalstore.js for more
        setChartWithLocalstoreData(constants.chartRawdataData, prosessRawData);
    }
    else {
        //Getting data. See chartLocalstore.js for more
        fetchData(null, constants.chart2CalcualtedData);
    }

    $("#chartContainer").addClass(parent.installationData.theme + 'Container');
    $("#main").addClass(parent.installationData.theme + 'Theme');
});


var dataMax = 0;
var dataTwoThirds = 0;
var dataOneThird = 0;
var dataMaxFullValue = 0;
var dataTwoThirdsFullValue = 0;
var dataOneThirdFullValue = 0;

var currentPrefix = 'kW';

var maxAmountOfSensors = 10;


var paddingLeft = 115;
var chartHeight = getChartHeight();
var now = new Date();

var chartModel = {
    data: [],
    groups: [],
    lastTempDate: null,
    actualMax: 0,
    actualMin: 0,
    temp: ['temp'],
    dataDates: ['datelabel'],
    indexForMaxSensor: 0,
    showTemp: true
};

function getChartHeight() {
    return (window.innerHeight / 100) * 39.8;
}

function prosessRawData(allRawData) {
    var rawData = allRawData.subs.days.subs;
    var count = 0;
    var firstKey = "";
    for (var key in rawData) {
        firstKey = count === 0 ? key : firstKey;
        count++;
        if (count > maxAmountOfSensors) {
            break;
        }
        var newSensor = [key];
        chartModel.groups.push(key);
        for (var y = 0; y < rawData[key].data.length; y++) {
            if (new Date(rawData[key].data[y].description + 'Z').getTime() <= now.getTime()) {
                newSensor.push(rawData[key].data[y].val);
                if (count === 1) {
                    chartModel.dataDates.push(rawData[key].data[y].description + 'Z');
                }
            }
        }
        chartModel.data.push(newSensor);
    }

    //ser gjennom det første datasettet og setter bruker siste dato vi har data herfra til å sette en backupdato i tilfelle tempdata ikke er angitt, 
    //for å kunne vise denne datoen rett under grafen
    setBackupDateForLastTempDate(rawData[firstKey].data);
    
    processRawTempData(allRawData);
}

function setBackupDateForLastTempDate(dataSet) {
    for (var i = dataSet.length; i > 0; i--) {
        if (dataSet[i - 1].val) {
            chartModel.lastTempDate = modifyLastTempDateWithClock(new Date(dataSet[i - 1].description + 'Z'));
            break;
        }
    }
}

function processRawTempData(allRawData) {
    
    if (allRawData.subs.temperature) {
        var rawTempData = allRawData.subs.temperature.data;

        for (var i = 0; i < rawTempData.length ; i++) {
            if (new Date(rawTempData[i].description + 'Z').getTime() <= now.getTime()) {
                chartModel.temp.push(rawTempData[i].val);
            }
        }
        var chartLastUpdated = new Date(rawTempData[chartModel.data[0].length - 2].description + 'Z'); //-2 pga chartModel.data[0] har en label som ligger først i arrayet
        chartModel.lastTempDate = modifyLastTempDateWithClock(chartLastUpdated);

        chartModel.data.push(chartModel.temp);
        chartModel.actualMax = Math.max.apply(null, chartModel.temp.slice(1));
        chartModel.actualMin = Math.min.apply(null, chartModel.temp.slice(1));
        setLocalStoreData(constants.chart2CalcualtedData, chartModel);
    }
    else {
        chartModel.showTemp = false;
    }
   

    populateChart();
}

function modifyLastTempDateWithClock(lastTempDate) {
    return ('0' + (lastTempDate.getDate())).slice(-2) + "." + ('0' + (lastTempDate.getMonth() + 1)).slice(-2) + " kl " + getTwoDigitClock(lastTempDate);
}

function prosessCalculatedData(data) {
    chartModel = data;
    populateChart();
}

function findDataAverageValues() {
    //TODO: Erstatte sensors med data fra server
    var maxValue = 0;
    var data = chartModel.data;
    var amountOfSensors = chartModel.groups.length; //Exclude temp sensor
    var amountOfDataRows = data[0].length;
    //i = 1 because first cell is text, not number
    for (var i = 0; i < amountOfDataRows; i++) {
        var amountToCheckAgainstMax = 0;

        for (var y = 0; y < amountOfSensors; y++) {
            //Sjekk at data ikke er null
            if (data[y][i]) {
                amountToCheckAgainstMax += data[y][i];
            }
        }
        if (amountToCheckAgainstMax > maxValue) {
            maxValue = amountToCheckAgainstMax;
            chartModel.indexForMaxSensor = i;
        }
    }
    var maxUsageDate = new Date(chartModel.dataDates[chartModel.indexForMaxSensor]);
    chartModel.dataDates[chartModel.indexForMaxSensor] = ('0' + (maxUsageDate.getDate())).slice(-2) + "." + ('0' + (maxUsageDate.getMonth() + 1)).slice(-2) + " kl " + getTwoDigitClock(maxUsageDate);
    dataMax = Math.round(maxValue);

    calculateDataValues();

    //Verdier for bruk i grafen (må være full verdi)
    dataMaxFullValue = dataMax;
    dataTwoThirdsFullValue = dataTwoThirds;
    dataOneThirdFullValue = dataOneThird;

    //I tilfelle vi møter på større tall
    currentPrefix = dataMax > 1000 ? 'MW' : currentPrefix;

    dataMax = roundDataValueBasedOnPrefix(dataMax);
    dataTwoThirds = roundDataValueBasedOnPrefix(dataTwoThirds);
    dataOneThird = roundDataValueBasedOnPrefix(dataOneThird);
}

function calculateDataValues(){
    dataTwoThirds = Math.round((dataMax * 2) / 3);
    dataOneThird = Math.round(dataMax / 3);
}

function roundDataValueBasedOnPrefix(dataValue) {
    return currentPrefix === 'MW' ? roundToTwo(dataValue * 0.001) : dataValue;
}

function calculateLeftPadding() {
    var temperaturLabelWidth = 50;
    paddingLeft = (dataMax.toString().length * 28) + temperaturLabelWidth;
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
            height: chartHeight
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
            order: null,
            axes: {
                temp: 'y2'
            }
        },
        legend: {
            show: false
        },
        axis: {
            y: {
                show: chartModel.showTemp,
                padding: {
                    top: 100
                },
                tick: {
                    format: function (x) { return " " + roundDataValueBasedOnPrefix(x) + currentPrefix + " -"; },
                    count: 3,
                    values: [dataOneThirdFullValue, dataTwoThirdsFullValue, dataMaxFullValue]
                }
            },
            y2: {
                show: chartModel.showTemp,
                max: chartModel.actualMax + (chartModel.actualMax - chartModel.actualMin) * 0.5,
                min: chartModel.actualMin - (chartModel.actualMax - chartModel.actualMin) * 0.5,
                tick: {
                    format: function (x) { return x + "°C"; },
                    count: 3,
                    values: [chartModel.actualMin, chartModel.actualMax]
                }
            },
            x: {
                show: true,
                tick: {
                    format: function (x) { if (x === 0 || x === 24) { return ""; } }
                }
            },
            x2: {
                show: true
            }
        },
        bar: {
            width: {
                ratio: 0.85
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
    if (chartModel.showTemp) {
        makePathGoAllTheWayAndGetLastXY();
    }
    ko.applyBindings({
        groups: chartModel.groups,
        getClass: function (index) {
            return 'sensorLabel' + (this.groups.indexOf(index) + 1);
        },
        dataMax: dataMax + currentPrefix,
        lastNight: chartModel.lastTempDate,
        maxMeasuredDate: chartModel.dataDates[chartModel.indexForMaxSensor]
    });

    adjustXTicks();
    expandWhiteBand();
}


function expandWhiteBand() {
    var chart = $("#chart");
    var chart2MarginFix = 28;
    $("#whiteBand").css({ "top": chart.offset().top + (chart.height()) - (chart2MarginFix) + "px" });
    chart.addClass('chart2MarginFix');
}

function adjustXTicks() {
    //minus 2 pga length vs index samt label
    /*var maxLength = (chartModel.data[0].length - 2);*/

    $(".c3-axis.c3-axis-x line").each(function ($i) {
        if (($i + 1) % 24 === 0) {
            $(this).attr('y2', 12);
        }
        else {
            $(this).hide();
        }
    });
}


//Markerer bar som har høyeste verdi
function markHighestBar() {
    var highestBars = $('.c3-bar-' + (chartModel.indexForMaxSensor - 1));
    highestBars.addClass("markedBar");
    var firstHighest = highestBars.first();
    var pathdata = firstHighest.attr('d');
    var paths = pathdata.split(',');
    var pathDataY = parseInt(paths[paths.length - 1].replace(' z', '').split('.')[0]);

    var pathWidht = parseInt(paths[2].split(' ')[1].replace('L', '').split('.')[0]) - parseInt(paths[0].split(' ')[1].replace('L', '').split('.')[0]);

    var topContainerHeight = $("#topContainer").height();
    var spaceBetweenTopOfBarAndChartTop = chartHeight - pathDataY;
    try {
        var maksTimesforbrukLabel = $("#maksTimesforbrukLabel");

        maksTimesforbrukLabel.css({ 'top': (topContainerHeight + spaceBetweenTopOfBarAndChartTop + (maksTimesforbrukLabel.height() - 10)) + 'px', 'left': (firstHighest.offset().left - (pathWidht / 2) - 1 - maksTimesforbrukLabel.width() / 2) + 'px' });
    }
    catch (e) {
        console.error('calculating markedHighestBars label failed');
    }
}

//Gjøre line graf litt lenger på slutten
function makePathGoAllTheWayAndGetLastXY() {
    var path = $(".c3-line-temp").first();
    var pathData = path.attr('d').split(',');
    pathData[pathData.length - 2] = (parseFloat(pathData[pathData.length - 2]) + 20).toString();
    path.attr('d', pathData);
}

