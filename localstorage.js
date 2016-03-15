function hasRecentData(type) {
    console.log('hasRecentData() ', type)
    switch (type) {
        case constants.installationData:
            var date = window.localStorage.getItem(constants.installationTime);
            var d1 = new Date();
            var d2 = new Date(d1);
            d2.setHours(d1.getHours() - constants.InstallationFetchIntervalInHours);
            return date !== null && date !== undefined && Date.parse(date) > d2.getTime();
            break;
        case constants.chart1CalcualtedData:
            var date = window.localStorage.getItem(constants.chart1CalcualtedTime);
            var d1 = new Date();
            var d2 = new Date(d1);
            d2.setHours(d1.getMonth() - constants.chart1FetchIntervalInHours);
            return date !== null && date !== undefined && Date.parse(date) > d2.getTime();
            break;
        case constants.chart2CalcualtedData:
            var date = window.localStorage.getItem(constants.chart2CalcualtedTime);
            var d1 = new Date();
            var d2 = new Date(d1);
            d2.setHours(d1.getHours() - constants.chart2FetchIntervalInHours);
            return date !== null && date !== undefined && Date.parse(date) > d2.getTime();
            break;
        case constants.chartRawdataData:
            var date = window.localStorage.getItem(constants.chartRawdataTime);
            var d1 = new Date();
            var d2 = new Date(d1);
            d2.setHours(d1.getHours() - constants.InstallationFetchIntervalInHours);
            return date !== null && date !== undefined && Date.parse(date) > d2.getTime();
            break;
        case constants.yrData:
            var date = window.localStorage.getItem(constants.yrTime);
            var d1 = new Date();
            var d2 = new Date(d1);
            d2.setHours(d1.getHours() - constants.yrFetchIntervalInHours);
            return date !== null && date !== undefined && Date.parse(date) > d2.getTime();
            break;
        default:
            console.log('hasRecentData() -> type not set or invalid');
            return false;
    }
}


function getLocalstoreData(type) {
    var data = null;
    var ls = null;
    switch (type) {
        case constants.installationData:
            ls = window.localStorage.getItem(constants.installationData);
            break;
        case constants.chart1CalcualtedData:
            ls = window.localStorage.getItem(constants.chart1CalcualtedData);
            break;
        case constants.chart2CalcualtedData:
            ls = window.localStorage.getItem(constants.chart2CalcualtedData);
            break;
        case constants.chartRawdataData:
            ls = window.localStorage.getItem(constants.chartRawdataData);
            break;
        case constants.yrData:
            ls = window.localStorage.getItem(constants.yrData);
            break;
        default:
            console.log('Error: setChartWithLocalstoreData() -> type not set or invalid');
            break;
    }
    if (ls) {
        data = JSON.parse(ls);
    }
    return data;
}

function setLocalStoreData(type, data) {
    if (!data) {
        console.log('Error: setLocalStoreData() -> data is not defined!');
        return;
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
            window.localStorage.setItem(constants.chartRawdataTime, new Date());
            window.localStorage.setItem(constants.chartRawdataData, JSON.stringify(data));
            break;
        case constants.yrData:
            console.log('Setting rawdata for charts');
            window.localStorage.setItem(constants.yrTime, new Date());
            window.localStorage.setItem(constants.yrData, JSON.stringify(data));
            break;
        default:
            console.log('Error: setLocalStoreData() -> type not set or invalid');
            return;
    }
}