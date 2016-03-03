

function isNullOrEmpty(variabel) {
    return variabel === null || variabel === undefined
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
    api: 'http://skagerak-dpnmn.rhcloud.com/api/',
    installation: 'installation/{id}',
    client: 'installation/{id}/clients',
    installationData: 'installationData',
    installationTime: 'installationTime'
}