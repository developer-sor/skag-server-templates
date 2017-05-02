

var windowRef = window.location.pathname.replace('skag-server-templates', '').indexOf('templates/') === -1 ? window : parent.window;

function hasRecentData(type, infoslideId) {
    switch (type) {
        case constants.installationData:
            var date = windowRef.localStorage.getItem(constants.installationTime);
            var d1 = new Date();
            var d2 = new Date(d1);
            d2.setMinutes(d1.getMinutes() - constants.InstallationFetchIntervalInMinutes);
            return date !== null && date !== undefined && Date.parse(date) > d2.getTime();
            break;
        case constants.chart1CalcualtedData:
            var date = windowRef.localStorage.getItem(constants.chart1CalcualtedTime);
            var d1 = new Date();
            var d2 = new Date(d1);
            d2.setHours(d1.getHours() - constants.chart1FetchIntervalInHours);
            return date !== null && date !== undefined && Date.parse(date) > d2.getTime();
            break;
        case constants.chart2CalcualtedData:
            var date = windowRef.localStorage.getItem(constants.chart2CalcualtedTime);
            var d1 = new Date();
            var d2 = new Date(d1);
            d2.setMinutes(d1.getMinutes() - constants.chart2FetchIntervalInMinutes);
            return date !== null && date !== undefined && Date.parse(date) > d2.getTime();
            break;
        case constants.chartRawdataData:
            var date = windowRef.localStorage.getItem(constants.chartRawdataTime);
            var d1 = new Date();
            var d2 = new Date(d1);
            d2.setMinutes(d1.getMinutes() - constants.InstallationFetchIntervalInMinutes);
            return date !== null && date !== undefined && Date.parse(date) > d2.getTime();
            break;
        case constants.yrData:
            var date = windowRef.localStorage.getItem(constants.yrTime);
            var d1 = new Date();
            var d2 = new Date(d1);
            d2.setMinutes(d1.getMinutes() - constants.yrFetchIntervalInMinutes);
            return date !== null && date !== undefined && Date.parse(date) > d2.getTime();
            break;
        case constants.informasjonData:
            var date = windowRef.localStorage.getItem(constants.informasjonTime+infoslideId);
            var d1 = new Date();
            var d2 = new Date(d1);
            d2.setMinutes(d1.getMinutes() - constants.informasjonFetchIntervalInMinutes);
            return date !== null && date !== undefined && Date.parse(date) > d2.getTime();
            break;
        default:
            console.log('hasRecentData() -> type not set or invalid');
            return false;
    }
}


function getLocalstoreData(type, infoslideId) {
    var data = null;
    var ls = null;
    switch (type) {
        case constants.installationData:
            ls = windowRef.localStorage.getItem(constants.installationData);
            break;
        case constants.chart1CalcualtedData:
            ls = windowRef.localStorage.getItem(constants.chart1CalcualtedData);
            break;
        case constants.chart2CalcualtedData:
            ls = windowRef.localStorage.getItem(constants.chart2CalcualtedData);
            break;
        case constants.chartRawdataData:
            ls = windowRef.localStorage.getItem(constants.chartRawdataData);
            break;
        case constants.yrData:
            ls = windowRef.localStorage.getItem(constants.yrData);
            break;
        case constants.informasjonData:
            ls = windowRef.localStorage.getItem(constants.informasjonData+infoslideId);
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

function setLocalStoreData(type, data, infoslideId) {
    if (!data) {
        console.log('Error: setLocalStoreData() -> data is not defined!');
        return;
    }

    switch (type) {
        case constants.chart1CalcualtedData:
            //console.log('Setting calculated data for chart1');
            windowRef.localStorage.setItem(constants.chart1CalcualtedTime, new Date());
            windowRef.localStorage.setItem(constants.chart1CalcualtedData, JSON.stringify(data));
            break;
        case constants.chart2CalcualtedData:
            //console.log('Setting calculated data for chart2');
            windowRef.localStorage.setItem(constants.chart2CalcualtedTime, new Date());
            windowRef.localStorage.setItem(constants.chart2CalcualtedData, JSON.stringify(data));
            break;
        case constants.chartRawdataData:
            //console.log('Setting rawdata for charts');
            windowRef.localStorage.setItem(constants.chartRawdataTime, new Date());
            windowRef.localStorage.setItem(constants.chartRawdataData, JSON.stringify(data));
            break;
        case constants.yrData:
            //console.log('Setting data for yr');
            windowRef.localStorage.setItem(constants.yrTime, new Date());
            windowRef.localStorage.setItem(constants.yrData, JSON.stringify(data));
            break;
        case constants.informasjonData:
            //console.log('Setting data for informasjonsslide');
            windowRef.localStorage.setItem(constants.informasjonTime+infoslideId, new Date());
            windowRef.localStorage.setItem(constants.informasjonData+infoslideId, JSON.stringify(data));
            break;
        default:
            console.log('Error: setLocalStoreData() -> type not set or invalid');
            return;
    }
}


function hasNonExpiredData(type, infoslideId) {
    //console.log('hasNonExpiredData() ', type)
    switch (type) {
        case constants.chart1CalcualtedData:
            var date = windowRef.localStorage.getItem(constants.chart1CalcualtedTime);
            var d1 = new Date();
            var d2 = new Date(d1);
            d2.setMonth(d1.getMonth() - constants.chart1ExpireMonths);
            return date !== null && date !== undefined && Date.parse(date) > d2.getTime();
            break;
        case constants.chart2CalcualtedData:
            var date = windowRef.localStorage.getItem(constants.chart2CalcualtedTime);
            var d1 = new Date();
            var d2 = new Date(d1);
            d2.setHours(d1.getHours() - constants.chart2ExpireHours);
            return date !== null && date !== undefined && Date.parse(date) > d2.getTime();
            break;
        case constants.chartRawdataData:
            var date = windowRef.localStorage.getItem(constants.chartRawdataTime);
            var d1 = new Date();
            var d2 = new Date(d1);
            d2.setMinutes(d1.getMinutes() - constants.chartRawdataExpireMinutes);
            return date !== null && date !== undefined && Date.parse(date) > d2.getTime();
            break;
        case constants.yrData:
            var date = windowRef.localStorage.getItem(constants.yrTime);
            var d1 = new Date();
            var d2 = new Date(d1);
            d2.setHours(d1.getHours() - constants.yrExpireHours);
            return date !== null && date !== undefined && Date.parse(date) > d2.getTime();
            break;
        case constants.informasjonData:
            var date = windowRef.localStorage.getItem(constants.informasjonTime+infoslideId);
            var d1 = new Date();
            var d2 = new Date(d1);
            d2.setHours(d1.getHours() - constants.informasjonExpireHours);
            return date !== null && date !== undefined && Date.parse(date) > d2.getTime();
            break;
        default:
            console.log('hasNonExpiredData() -> type not set or invalid');
            return false;
    }
}