
var skipForYr = skipForYr || false;
//Set default AJAX headers
var currentInstallation = parent ? parent.installation : installation;
if (currentInstallation && !skipForYr) {
    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader('ClientKey', currentInstallation.clientKey);
        }
    });
}
else {
    console.log('yr template. skipping ajax setup');
}


function isNullOrEmpty(varToCheck) {
    if (typeof varToCheck === 'object') {
        console.log('isNullOrEmpty, varToCheck is object.');
        return false;
    }

    if (!varToCheck) {
        return true;
    }
    return varToCheck === null || varToCheck === "";
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

function getTwoDigitClock(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    return ('0' + hours).slice(-2) + ":" + ('0' + minutes).slice(-2)
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
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

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}