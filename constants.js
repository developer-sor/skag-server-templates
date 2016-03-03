

function isNullOrEmpty(variabel) {
    return variabel === null; //|| variabel === "" TODO: legge inn denne når vi har valid data
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
    api: 'http://skagerak-dpnmn.rhcloud.com/api/',
    installation: 'installation/{id}',
    client: 'installation/{id}/clients',
    dataview: 'installation/{id}/dataview'
}