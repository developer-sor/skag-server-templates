

//Set default AJAX headers
var currentInstallation = parent ? parent.installation : installation;
if (currentInstallation) {
    console.log('running ajaxSetup');
    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader('ClientKey', currentInstallation.clientKey);
        }
    });
}


function isNullOrEmpty(varToCheck) {
    if (typeof varToCheck === 'object') {
        console.log('isNullOrEmpty, varToCheck is object.');
        return varToCheck.length > 1;
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