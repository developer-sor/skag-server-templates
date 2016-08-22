

$(function () {
    if (parent.forceFetch) {
        fetchData(null, constants.chart1CalcualtedData);
    }
    else if (hasRecentData(constants.chart1CalcualtedData) && hasRecentData(constants.chartRawdataData)) {
        isFetchingData = false;
        setChartWithLocalstoreData(constants.chart1CalcualtedData, prosessCalculatedData);
    }
    else if (hasRecentData(constants.chartRawdataData)) {
        isFetchingData = false;
        //Setting data based on local storage data. See chartLocalstore.js for more
        setChartWithLocalstoreData(constants.chartRawdataData, prosessRawData);
    }
    else {
        //Getting data. See chartLocalstore.js for more
        fetchData(null, constants.chart1CalcualtedData);
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
};

function prosessRawData(allRawData) {
    var rawData = allRawData.subs.months.data;

    var referenceData = [chartModel.referenceLabel];
    var compareData = [chartModel.compareLabelDefault];

    //Kun for console log purpose
    var totalRef = 0;
    var totalActual = 0;
    //
    console.log(rawData);

    for (var i = 0; i < rawData.length; i++) {
        chartModel.categories.push(rawData[i].description);

        var currentDate = new Date();
        chartModel.years.push(currentDate.getMonth() + 1 >= rawData[i].ind ? currentDate.getFullYear() : currentDate.getFullYear() - 1);
        
        var referenceValue = rawData[i].ref;
        var actualValue = rawData[i].val;

        referenceData.push(referenceValue);
        compareData.push(actualValue);

        chartModel.savedAmount += (referenceValue - actualValue);

        console.log(rawData[i]);
        //Kun for console log purpose
        totalRef += referenceValue;
        totalActual += rawData[i].val;
        //
    }

    console.log('Totaltverdi av "ref" data sammenlagt: ', totalRef);
    console.log('Totaltverdi av "val" data sammenlagt: ', totalActual);

    chartModel.data.push(referenceData, compareData);
    setLocalStoreData(constants.chart1CalcualtedData, chartModel);

    populateChart();
}

function prosessCalculatedData(data) {
    chartModel = data;
    populateChart();
}

function getChartHeight() {
    return (window.innerHeight / 100) * 49;
}

function populateChart() {
    var chart = c3.generate({
        bindto: '#chart',
        padding: {
            top: 50
        },
        size: {
            height: getChartHeight()
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
    if (chartModel.savedAmount > 100000000) {
        amountPrefix.text('GWh');
        chartModel.savedAmount = Math.round(chartModel.savedAmount * 0.000001);
    }
    else if (chartModel.savedAmount > 100000) {
        amountPrefix.text('MWh');
        chartModel.savedAmount = Math.round(chartModel.savedAmount * 0.001);
    }
    else {
        amountPrefix.text('kWh');
        chartModel.savedAmount = Math.round(chartModel.savedAmount);
    }
    console.log('Totalt innspart ', chartModel.savedAmount + ' ' + amountPrefix.text());
    if (chartModel.savedAmount > 0) {
        $("#amountSaved").text(chartModel.savedAmount);
        $("#saved").show();
    }
    else {
        $("#saved").hide();
    }
}

function expandWhiteBand() {
    var chartContainer = $("#chart");
    $("#whiteBand").css({ "top": chartContainer.offset().top + chartContainer.height() + "px" });
}