if (getParameterByName('key')) {
    installation.key = getParameterByName('key');
    window.localStorage.removeItem(constants.installationTime);
    window.localStorage.removeItem(constants.installationData);
    window.localStorage.removeItem(constants.refChartTime);
    window.localStorage.removeItem(constants.refChartData);
    window.localStorage.removeItem(constants.yrTime);
    window.localStorage.removeItem(constants.yrData);
}

if (getParameterByName('clear')) {
    var clearData = getParameterByName('clear');
    if (clearData && clearData == 'true') {
        console.log('clearing localstorage');
        window.localStorage.clear();
    }
}

var forceFetch = false;
if (getParameterByName('forceFetch')) {
    var forceFetch = getParameterByName('forceFetch');
    if (forceFetch && forceFetch == 'true') {
        console.log('Forcing fetch of new data');
    }
}