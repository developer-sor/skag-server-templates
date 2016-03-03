function hasRecentChartData() {
    var date = window.localStorage.getItem(constants.refChartTime);
    var d1 = new Date();
    var d2 = new Date(d1);
    d2.setHours(d1.getHours() + constants.refChartRefreshHours);

    return date !== null && date !== undefined && Date.parse(date) < d2.getTime();
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