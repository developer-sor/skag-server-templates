

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
    else if (hasRecentData(constants.chart1CalcualtedData)) {
        console.log('getting calcualted data for chart1');
        isFetchingData = false;
        setChartWithLocalstoreData(constants.chart1CalcualtedData, prosessCalculatedData);
    }
    else if (hasRecentData(constants.chartRawdataData)) {
        console.log('getting raw data for chart1');
        isFetchingData = false;
        //Setting data based on local storage data. See chartLocalstore.js for more
        setChartWithLocalstoreData(constants.chartRawdataData, prosessRawData);
    }
    else {
        //Getting data. See chartLocalstore.js for more
        console.log('running fetchData() for chart1. No valid local data stored');
        fetchData(prosessRawData);
    }

    $("#chartContainer").addClass(parent.installationData.theme + 'Container');
    $("#main").addClass(parent.installationData.theme + 'Theme');
});



var chartModel = {
    referenceLabel : '0',
    compareLabelDefault : new Date().getFullYear().toString(),
    categories : [],
    years : [],
    data : [],
    savedAmount : 0
}

function prosessRawData(allRawData) {
    var rawData = allRawData.subs.months.data;

    var referenceData = [chartModel.referenceLabel];
    var compareData = [chartModel.compareLabelDefault];

    for (var i = 0; i < rawData.length; i++) {
        chartModel.categories.push(rawData[i].description);

        var currentDate = new Date();
        chartModel.years.push(currentDate.getMonth() + 1 >= rawData[i].ind ? currentDate.getFullYear() : currentDate.getFullYear() - 1);

        referenceData.push(rawData[i].ref);
        compareData.push(rawData[i].val);

        chartModel.savedAmount += (rawData[i].ref - rawData[i].val);
    }
    chartModel.data.push(referenceData, compareData);
    setLocalStoreData(constants.chart1CalcualtedData, chartModel);

    populateChart();
}

function prosessCalculatedData(data) {
    console.log('prosessCalculatedData() ', data);
    chartModel = data;
    populateChart();
}


function populateChart() {
    var chart = c3.generate({
        bindto: '#chart',
        padding: {
            top: 50
        },
        size: {
            height: 560
        },
        data: {
            columns: chartModel.data,
            type: 'bar',
            labels: {
                format: function (v, id, i, j) {
                    return id == '0' ? parent.installationData.referenceLabel || 'Reference' : chartModel.years[i];
                }
            }
        },
        axis: {
            y: {
                show: false
            },
            x: {
                show: false
            }
        },
        legend: {
            show: false
        },
        bar: {
            width: {
                ratio: 0.7,
            }
        },
        tooltip: {
            show: false
        }
    });

    setCategories();
    savedAmount();
    expandWhiteBand();
}

function setCategories() {
    var categoriesHTML = '';
    for (var i = 0; i < chartModel.categories.length; i++) {
        categoriesHTML += '<span class="category" style="width:' + (100 / chartModel.categories.length) + '%"><h3>' + chartModel.categories[i] + '</h3></span>';
    }
    $("#months").html(categoriesHTML);
}


function savedAmount() {
    var amountPrefix = $("#amountPrefix");
    if (chartModel.savedAmount > 1000000) {
        amountPrefix.text('GWh');
        chartModel.savedAmount = roundToTwo(chartModel.savedAmount * 0.000001);
    }
    else if (chartModel.savedAmount > 1000) {
        amountPrefix.text('MWh');
        chartModel.savedAmount = roundToTwo(chartModel.savedAmount * 0.001);
    }
    else {
        amountPrefix.text('kWh');
        chartModel.savedAmount = roundToTwo(chartModel.savedAmount);
    }

    if (chartModel.savedAmount > 0) {
        $("#amountSaved").text(chartModel.savedAmount);
        $("#saved").show();
    }
    else {
        $("#saved").hide();
    }
}

function expandWhiteBand() {
    var chartContainer = $("#chartContainer");
    $("#whiteBand").css({ "top": chartContainer.offset().top + chartContainer.height() + "px" });
}