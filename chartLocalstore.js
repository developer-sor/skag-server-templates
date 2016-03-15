var isFetchingData = false;



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

function fetchData(prosessRawData, type) {
    console.log('fetchData()');
    isFetchingData = true;
    var self = this;
    var prosessRawData = prosessRawData || self.prosessRawData;
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

    var url = constants.api+ constants.dataview.replace('{id}', installationId);
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
    .done(function (response) {
        if (response) {
            console.log("done retrieving data for chart");
            setLocalStoreData(constants.chartRawdataData, response);
            self.prosessRawData(response);
        }
        else {
            handleError(type, self.prosessRawData);
        }
    })
    .fail(function (error) {
        console.log('Error fetching data from server: ', error);
        handleError(type, self.prosessRawData);
    })
    .always(function () {
        isFetchingData = false;
    });
}


function handleError(type, prosessRawData) {
    if (hasNonExpiredData(type)) {
        console.log('Backup solution: getting calculated chartdata from localstorage since fetch failed');
        self.setChartWithLocalstoreData(type, prosessCalculatedData);
    }
    else if (hasNonExpiredData(constants.chartRawdataData)) {
        console.log('Backup solution: getting raw chartdata from localstorage since fetch failed');
        self.setChartWithLocalstoreData(constants.chartRawdataData, prosessRawData);
    }
    else {
        console.log('Backup solution failed! No chartdata in localstorage and fetch failed for ' + type + ', running next slide');
        parent.templateController.abortSlide(template.name);
    }
}