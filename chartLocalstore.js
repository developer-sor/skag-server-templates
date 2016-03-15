var devMode = false;
var isFetchingData = false;

function hasRecentChartData(type) {

    switch (type) {
        case constants.chart1CalcualtedData:
            var date = window.localStorage.getItem(constants.chart1CalcualtedTime);
            var d1 = new Date();
            var d2 = new Date(d1);
            d2.setHours(d1.getMonth() - constants.chart1ExpireMonths);
            return date !== null && date !== undefined && Date.parse(date) > d2.getTime();
            break;
        case constants.chart2CalcualtedData:
            var date = window.localStorage.getItem(constants.chart2CalcualtedTime);
            var d1 = new Date();
            var d2 = new Date(d1);
            d2.setHours(d1.getHours() - constants.chart2ExpireHours);
            return date !== null && date !== undefined && Date.parse(date) > d2.getTime();
            break;
        case constants.chartRawdataData:
            var date = window.localStorage.getItem(constants.chartRawdataTime);
            var d1 = new Date();
            var d2 = new Date(d1);
            d2.setHours(d1.getHours() - constants.refRawdataExpireHours);
            return date !== null && date !== undefined && Date.parse(date) > d2.getTime();
            break;
        default:
            console.log('hasRecentChartData() -> type not set or invalid');
            return;
    }
}

function hasValidChartData() {
    var tempData = window.localStorage.getItem(constants.refChartData);
    return !isNullOrEmpty(tempData);
}

function setChartWithLocalstoreData(type, callback) {
    if (!callback) {
        console.log('Error: setChartWithLocalstoreData() -> callback is not set!');
        return;
    }
    var data = null;
    switch (type) {
        case constants.chart1CalcualtedData:
            data = JSON.parse(window.localStorage.getItem(constants.chart1CalcualtedData));
            break;
        case constants.chart2CalcualtedData:
            data = JSON.parse(window.localStorage.getItem(constants.chart2CalcualtedData));
            break;
        case constants.chartRawdataData:
            data = JSON.parse(window.localStorage.getItem(constants.chartRawdataData));
            break;
        default:
            console.log('Error: setChartWithLocalstoreData() -> type not set or invalid');
            return;
    }

    if (data) {
        callback(data);
    }
    else {
        fetchData(callback);
    }
}

function setChartLocalStoreData(type, data) {
    if (!data) {
        console.log('Error: setChartLocalStoreData() -> rawData is not defined!');
    }

    switch (type) {
        case constants.chart1CalcualtedData:
            console.log('Setting calculated data for chart1');
            window.localStorage.setItem(constants.chart1CalcualtedTime, new Date());
            window.localStorage.setItem(constants.chart1CalcualtedData, JSON.stringify(data));
            break;
        case constants.chart2CalcualtedData:
            console.log('Setting calculated data for chart2');
            window.localStorage.setItem(constants.chart2CalcualtedTime, new Date());
            window.localStorage.setItem(constants.chart2CalcualtedData, JSON.stringify(data));
            break;
        case constants.chartRawdataData:
            console.log('Setting rawdata for charts');
            window.localStorage.setItem(constants.refChartTime, new Date());
            window.localStorage.setItem(constants.refChartData, JSON.stringify(data));
            break;
        default:
            console.log('Error: setChartLocalStoreData() -> type not set or invalid');
            return;
    }
}

function fetchData(prosessRawData) {
    isFetchingData = true;
    var self = this;
    var installationId = devMode ? "29" : parent.installationData.id;
    var clientKey = devMode ? "Birkelid_Songdalen" : parent.installation.clientKey;

    if (!parent.installationData) {
        return;
    }

    var url = constants.api + constants.dataview.replace('{id}', installationId);

    //Ping
    $.ajax({
        method: "GET",
        contentType: "application/json",
        url: url,
        dataType: 'json',
        headers: {
            "clientKey": self.clientKey
        }
    }).done(function (response) {
        console.log('pinged server');
    });


    //Fetch data
    $.ajax({
        method: "GET",
        contentType: "application/json",
        url: url,
        dataType: 'json',
        headers: {
            "clientKey": self.clientKey
        }
    })
    .done(function (data) {
        if (data) {
            console.log("done retrieving data for chart");
            setChartLocalStoreData(constants.chartRawdataData, data);
            self.prosessRawData(data);
        }
        else if (!data && self.hasValidChartData()) {
            console.log('Backup solution: getting raw chartdata from localstorage since fetch failed');
            self.setChartWithLocalstoreData(prosessRawData);
        }
        else {
            console.log('Backup solution failed! No chartdata in localstorage and fetch failed, running next slide');
            parent.templateController.abortSlide(template.name);
        }
    })
    .fail(function (error) {
        console.log('Error fetching data from server: ', error);
        if (self.hasValidChartData()) {
            console.log('Backup solution: getting raw chartdata from localstorage since fetch failed');
            self.setChartWithLocalstoreData(prosessRawData);
        }
        else {
            console.log('Backup solution failed! No chartdata in localstorage and fetch failed, running next slide');
            parent.templateController.abortSlide(template.name);
        }
    })
    .always(function () {
        isFetchingData = false;
    });
}