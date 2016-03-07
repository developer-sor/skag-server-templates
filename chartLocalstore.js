var devMode = false;

function hasRecentChartData() {
    var date = window.localStorage.getItem(constants.refChartTime);
    var d1 = new Date();
    var d2 = new Date(d1);
    d2.setHours(d1.getHours() - constants.refChartRefreshHours);

    return date !== null && date !== undefined && Date.parse(date) > d2.getTime();
}

function hasValidChartData() {
    var tempData = window.localStorage.getItem(constants.refChartData);
    if (isNullOrEmpty(tempData)) {
        return false;
    }
    tempData = JSON.parse(tempData);
    //Checking if required strings is okay
    return !isNullOrEmpty(tempData);
}

function setChartWithLocalstoreData(callback) {
    if (!callback) {
        console.log('Error: setChartWithLocalstoreData() -> callback is not set!');
        return;
    }
    var rawData = JSON.parse(window.localStorage.getItem(constants.refChartData));
    callback(rawData);
}

function setChartLocalStoreData(rawData) {
    if (!isNullOrEmpty(rawData)) {
        window.localStorage.setItem(constants.refChartTime, new Date());
        window.localStorage.setItem(constants.refChartData, JSON.stringify(rawData));
    }
    else {
        console.log('Error: setChartLocalStoreData() -> rawData is not defined!');
    }
}

function fetchData() {
    console.log("devMode ? ", devMode);
    var self = this;
    var installationId = devMode ? "29" : parent.installationData.id;
    var clientKey = devMode ? "Birkelid_Songdalen" : parent.installation.clientKey;

    if (!parent.installationData) {
        return;
    }

    console.log(installationId);
    var url = constants.api + constants.dataview.replace('{id}', installationId);
    console.log('dataview url', url);
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
        if (!isNullOrEmpty(data)) {
            setChartLocalStoreData(data);
            prosessRawData(data);
        }
    });
}