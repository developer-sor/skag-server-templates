

function isNullOrEmpty(variabel) {
    if (!variabel) {
        return true;
    }
    return variabel === null || variabel === "";
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function convertToDataURLviaCanvas(url, callback, outputFormat) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null;
    };
    img.onerror = function () {
        callback('');
    }
    img.src = url;
}

var constants = {
    installationData: 'installationData',
    installationTime: 'installationTime',
    InstallationRefreshHours: 24,
    yrTime: 'yrTime',
    yrData: 'yrData',
    yrRefreshHours: 3,
    refChartTime: 'refChartTime',
    refChartData: 'refChartData',
    refChartRefreshHours: 12,
    api: 'http://ec2-52-58-27-236.eu-central-1.compute.amazonaws.com/api/',
    installation: 'installation/{key}',
    client: 'installation/{key}/clients',
    dataview: 'installation/{id}/dataview'
}