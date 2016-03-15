var isFetchingData = false;


function hasValidChartData() {
    var tempData = window.localStorage.getItem(constants.chartRawdataData);
    return !isNullOrEmpty(tempData);
}

function setChartWithLocalstoreData(type, callback) {
    if (!callback) {
        console.log('Error: setChartWithLocalstoreData() -> callback is not set!');
        return;
    }
    var data = getLocalstoreData(type);

    if (data) {
        callback(data);
    }
    else {
        fetchData(callback);
    }
}

function fetchData(prosessRawData) {
    console.log('fetchData()');
    isFetchingData = true;
    var self = this;
    var installationId = parent.installationData.id;
    var clientKey = parent.installation.clientKey;

    if (!parent.installationData) {
        console.log('Error: fetchData() -> missing parent.installationData')
        return;
    }

    var pingurl = constants.api + constants.ping.replace('{id}', installationId);

    //Ping
    $.ajax({
        method: "GET",
        contentType: "application/json",
        url: pingurl,
        dataType: 'json',
        headers: {
            "clientKey": self.clientKey
        }
    }).done(function (response) {
        console.log('pinged server');
    });

    var url = constants.api + constants.dataview.replace('{id}', installationId);
    //Fetch data
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
        if (data) {
            console.log("done retrieving data for chart");
            setLocalStoreData(constants.chartRawdataData, data);
            self.prosessRawData(data);
        }
        else if (!data && self.hasValidChartData()) {
            console.log('Backup solution: getting raw chartdata from localstorage since fetch failed');
            self.setChartWithLocalstoreData(prosessRawData);
        }
        else {
            console.log('Backup solution failed! No chartdata in localstorage and fetch failed, running next slide');
            parent.templateController.abortSlide(template.name);
        }
    })
    .fail(function (error) {
        console.log('Error fetching data from server: ', error);
        if (self.hasValidChartData()) {
            console.log('Backup solution: getting raw chartdata from localstorage since fetch failed');
            self.setChartWithLocalstoreData(prosessRawData);
        }
        else {
            console.log('Backup solution failed! No chartdata in localstorage and fetch failed, running next slide');
            parent.templateController.abortSlide(template.name);
        }
    })
    .always(function () {
        isFetchingData = false;
    });
}